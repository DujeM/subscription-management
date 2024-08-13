"use server";
import { auth } from "@/helpers/auth";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import EmailVerifyTemplate from "@/components/emailVerifyTemplate";
import { Resend } from "resend";
import Stripe from "stripe";
import { Customer } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createCustomer(formData: FormData) {
  "use server";
  const session = await auth();

  if (session === null) {
    redirect("auth/login");
  }

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const subscription = formData.get("multiselect") as string;
  const resend = new Resend(process.env.RESEND_KEY);
  const stripe = new Stripe(process.env.STRIPE_TEST_KEY as string);
  let newStripeSubscription: Stripe.Response<Stripe.Subscription>;
  const selectedSubscriptions = subscription ? subscription.split(",") : [];
  const subscriptions = await prisma.subscription.findMany({
    where: {
      clientId: session.user.id,
    },
  });

  try {
    const checkUserExists = await prisma.customer.findUnique({
      where: {
        email: email,
      },
    });

    if (checkUserExists) {
      throw new Error("A customer with that email address already exists.");
    }

    const newStripeCustomer = await stripe.customers.create(
      {
        name: fullName,
        email: email,
        metadata: {
          clientId: session.user.id,
        },
      },
      { stripeAccount: session.user.accountId }
    );

    if (subscription) {
      newStripeSubscription = await stripe.subscriptions.create(
        {
          customer: newStripeCustomer.id,
          collection_method: "send_invoice",
          days_until_due: 30,
          items: subscriptions
            .filter((s) => selectedSubscriptions.find((sub) => sub === s.id))
            .map((s) => {
              return { price: s.priceId };
            }),
        },
        { stripeAccount: session.user.accountId }
      );
    }

    const newCustomer = await prisma.customer.create({
      data: {
        fullName: fullName,
        email: email,
        address: address,
        phone: phone,
        emailConfirmed: false,
        emailToken: randomUUID(),
        clientId: session.user.id,
        customerId: newStripeCustomer.id,
        subscriptionId: subscription ? newStripeSubscription.id : "",
        subscriptions: {
          connect: subscription
            ? selectedSubscriptions.map((s) => {
                return {
                  id: s,
                };
              })
            : [],
        },
      },
      include: {
        subscriptions: true,
        client: true,
      },
    });

    await resend.emails.send({
      from: "subscribx@excode.hr",
      to: [email],
      subject: "Please confirm your email",
      react: EmailVerifyTemplate({
        fullName: newCustomer.fullName,
        clientName: newCustomer.client?.name,
        subscription: newCustomer.subscriptions.map((s) => s.title).join(", "),
        emailToken: newCustomer.emailToken,
      }),
    });
  } catch (error) {
    return { error: error.message ? error.message : "Something went wrong!" };
  }

  redirect("/customers");
}

export async function updateCustomer(
  formData: FormData,
  currentCustomer: Customer
) {
  "use server";
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const subscription = formData.get("multiselect") as string;
  const stripe = new Stripe(process.env.STRIPE_TEST_KEY as string);
  const session = await auth();

  if (session === null) {
    redirect("auth/login");
  }

  let subItems: Stripe.ApiList<Stripe.SubscriptionItem>;
  let newStripeSubscription: Stripe.Response<Stripe.Subscription>;
  const subscriptions = await prisma.subscription.findMany({
    where: {
      clientId: session?.user.id,
    },
  });
  const selectedSubscriptions = subscription
    ? subscription
        .split(",")
        .map((s) => subscriptions.find((sub) => sub.id === s))
    : [];

  try {
    if (currentCustomer.email !== email) {
      const checkUserExists = await prisma.customer.findUnique({
        where: {
          email: email,
        },
      });

      if (checkUserExists) {
        throw new Error("A customer with that email address already exists.");
      }
    }

    await stripe.customers.update(
      currentCustomer.customerId,
      {
        name: fullName,
        email: email,
      },
      { stripeAccount: session.user.accountId }
    );

    if (currentCustomer.subscriptionId) {
      subItems = await stripe.subscriptionItems.list(
        {
          subscription: currentCustomer.subscriptionId,
        },
        { stripeAccount: session.user.accountId }
      );
    }

    if (selectedSubscriptions.length) {
      if (subItems) {
        selectedSubscriptions.forEach(async (sub) => {
          if (
            !subItems.data.find((item) => item.price.product === sub.productId)
          ) {
            await stripe.subscriptionItems.create(
              {
                subscription: currentCustomer.subscriptionId,
                price: sub.priceId,
              },
              { stripeAccount: session.user.accountId }
            );
          }
        });
      } else {
        newStripeSubscription = await stripe.subscriptions.create(
          {
            customer: currentCustomer.customerId,
            collection_method: "send_invoice",
            days_until_due: 30,
            items: selectedSubscriptions.map((s) => {
              return { price: s.priceId };
            }),
          },
          { stripeAccount: session.user.accountId }
        );
      }
    }

    if (subItems && subItems.data.length) {
      subItems.data.forEach(async (item) => {
        if (
          !selectedSubscriptions.find(
            (sub) => sub.productId === item.price.product
          )
        ) {
          await stripe.subscriptionItems.del(item.id, {
            stripeAccount: session.user.accountId,
          });
        }
      });
    }

    await prisma.customer.update({
      where: {
        id: currentCustomer.id,
      },
      data: {
        fullName: fullName,
        email: email,
        address: address,
        phone: phone,
        emailConfirmed: false,
        clientId: session?.user.id,
        subscriptionId: newStripeSubscription
          ? newStripeSubscription.id
          : currentCustomer.subscriptionId,
        subscriptions: {
          set: subscription
            ? selectedSubscriptions.map((s) => {
                return {
                  id: s.id,
                };
              })
            : [],
        },
      },
    });
  } catch (error) {
    return { error: error.message ? error.message : "Something went wrong!" };
  }

  redirect("/customers");
}

export async function deleteCustomer(formData: FormData) {
  "use server";
  const session = await auth();

  if (session === null) {
    redirect("auth/login");
  }

  const customerId = formData.get("customerId") as string;
  const stripeCustomerId = formData.get("stripeCustomerId") as string;
  const scopeStripe = new Stripe(process.env.STRIPE_TEST_KEY as string);

  try {
    await prisma.customer.delete({
      where: {
        id: customerId,
      },
    });

    await scopeStripe.customers.del(stripeCustomerId, {
      stripeAccount: session.user.accountId,
    });
  } catch (error) {
    return { error: error.message ? error.message : "Something went wrong!" };
  }

  revalidatePath("/customers");
}
