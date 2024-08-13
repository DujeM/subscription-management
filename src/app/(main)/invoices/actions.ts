"use server";
import { auth } from "@/helpers/auth";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createInvoice(formData: FormData) {
  "use server";
  const stripe = new Stripe(process.env.STRIPE_TEST_KEY as string);
  const session = await auth();

  if (session === null) {
    redirect("auth/login");
  }

  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const stripeCustomerId = formData.get("customer") as string;
  const products = formData.get("multiselect") as string;
  const selectedProductsIds = products.split(",");
  const selectedProducts = await prisma.product.findMany({
    where: {
      clientId: session?.user.id,
      id: {
        in: selectedProductsIds,
      },
    },
  });

  try {
    const newStripeInvoice = await stripe.invoices.create(
      {
        description: description,
        auto_advance: false,
        collection_method: "send_invoice",
        days_until_due: 30,
        metadata: {
          clientId: session?.user.id,
        },
        customer: stripeCustomerId,
      },
      { stripeAccount: session.user.accountId }
    );

    selectedProducts.forEach(async (product) => {
      await stripe.invoiceItems.create(
        {
          customer: stripeCustomerId,
          price: product.priceId,
          invoice: newStripeInvoice.id,
        },
        { stripeAccount: session.user.accountId }
      );
    });

    const customer = await prisma.customer.findFirst({
      where: {
        customerId: stripeCustomerId,
      },
    });

    await prisma.invoice.create({
      data: {
        description: description,
        invoiceId: newStripeInvoice.id,
        priceIds: selectedProductsIds.join(", "),
        clientId: session?.user.id,
        customerId: customer.id,
      },
    });

    await stripe.invoices.finalizeInvoice(newStripeInvoice.id, {
      stripeAccount: session.user.accountId,
    });
  } catch (error) {
    return { error: error.message ? error.message : "Something went wrong!" };
  }

  redirect("/invoices");
}

export async function deleteInvoice(formData: FormData) {
  "use server";
  const session = await auth();

  if (session === null) {
    redirect("auth/login");
  }

  const invoiceId = formData.get("invoiceId") as string;
  const stripeInvoiceId = formData.get("stripeInvoiceId") as string;
  const scopeStripe = new Stripe(process.env.STRIPE_TEST_KEY as string);

  try {
    await prisma.invoice.delete({
      where: {
        id: invoiceId,
      },
    });

    await scopeStripe.products.update(
      stripeInvoiceId,
      {
        active: false,
      },
      { stripeAccount: session.user.accountId }
    );
  } catch (error) {
    return { error: error.message ? error.message : "Something went wrong!" };
  }

  revalidatePath("/invoices");
}
