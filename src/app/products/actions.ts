"use server";
import Stripe from "stripe";
import { auth } from "@/helpers/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Product } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  "use server";
  const session = await auth();
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
        },
        metadata: {
          clientId: session?.user.id,
        },
      },
      { stripeAccount: session.user.accountId }
    );

    await prisma.product.create({
      data: {
        title: title,
        description: description,
        currency: currency,
        price: price,
        productId: newStripeProduct.id,
        priceId: newStripeProduct.default_price.toString(),
        clientId: session?.user.id,
        taxCodeId: "",
      },
    });
  } catch (error) {
    return { error: error.message ? error.message : "Something went wrong!" };
  }

  redirect("/products");
}

export async function updateProduct(formData: FormData, product: Product) {
  "use server";
  const session = await auth();
  const scopeStripe = new Stripe(process.env.STRIPE_TEST_KEY as string);
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  try {
    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        title: title,
        description: description,
        clientId: session?.user.id,
      },
    });

    await scopeStripe.products.update(
      product.productId,
      {
        name: title,
        description: description,
      },
      { stripeAccount: session.user.accountId }
    );
  } catch (error) {
    return { error: error.message ? error.message : "Something went wrong!" };
  }

  redirect("/products");
}

export async function deleteProduct(formData: FormData) {
  "use server";
  const session = await auth();
  const productId = formData.get("productId") as string;
  const stripeProductId = formData.get("stripeProductId") as string;
  const scopeStripe = new Stripe(process.env.STRIPE_TEST_KEY as string);

  try {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    await scopeStripe.products.update(
      stripeProductId,
      {
        active: false,
      },
      { stripeAccount: session.user.accountId }
    );
  } catch (error) {
    return { error: error.message ? error.message : "Something went wrong!" };
  }

  revalidatePath("/products");
}
