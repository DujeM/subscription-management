"use server";

import { auth } from "@/helpers/auth";
import prisma from "@/lib/prisma";
import { Subscription } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Stripe from "stripe";

export async function createSubscription(formData: FormData) {
  "use server";
  const session = await auth();

  if (session === null) {
    redirect("auth/login");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const currency = formData.get("currency") as string;
  const price = formData.get("price") as string;
  const stripe = new Stripe(process.env.STRIPE_TEST_KEY as string);

  try {
    const newStripeProduct = await stripe.products.create(
      {
        name: title,
        description: description,
        default_price_data: {
          currency: currency,
          unit_amount: Number(price) * 100,
          recurring: {
            interval: "month",
          },
        },
        metadata: {
          clientId: session?.user.id,
        },
      },
      { stripeAccount: session.user.accountId }
    );

    await prisma.subscription.create({
      data: {
        title: title,
        description: description,
        currency: currency,
        price: price,
        productId: newStripeProduct.id,
        priceId: newStripeProduct.default_price.toString(),
        clientId: session?.user.id,
      },
    });
  } catch (error) {
    return { error: error.message ? error.message : "Something went wrong!" };
  }

  redirect("/subscriptions");
}

export async function updateSubscription(
  formData: FormData,
  sub: Subscription
) {
  "use server";
  const session = await auth();

  if (session === null) {
    redirect("auth/login");
  }

  const scopeStripe = new Stripe(process.env.STRIPE_TEST_KEY as string);
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  try {
    await prisma.subscription.update({
      where: {
        id: sub.id,
      },
      data: {
        title: title,
        description: description,
        clientId: session?.user.id,
      },
    });

    await scopeStripe.products.update(
      sub.productId,
      {
        name: title,
        description: description,
      },
      { stripeAccount: session.user.accountId }
    );
  } catch (error) {
    return { error: error.message ? error.message : "Something went wrong!" };
  }

  redirect("/subscriptions");
}

export async function deleteSubscription(formData: FormData) {
  "use server";
  const session = await auth();

  if (session === null) {
    redirect("auth/login");
  }

  const subId = formData.get("subId") as string;
  const productId = formData.get("productId") as string;
  const scopeStripe = new Stripe(process.env.STRIPE_TEST_KEY as string);

  try {
    await prisma.subscription.delete({
      where: {
        id: subId,
      },
    });

    await scopeStripe.products.update(
      productId,
      {
        active: false,
      },
      { stripeAccount: session.user.accountId }
    );
  } catch (error) {
    return { error: error.message ? error.message : "Something went wrong!" };
  }

  revalidatePath("/subscriptions");
}
