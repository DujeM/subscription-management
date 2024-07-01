import { auth } from "@/helpers/auth";
import getStripe from "@/lib/getStripe";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Stripe from 'stripe';

export default async function NewSubscriptionPage() {
    const session = await auth();
    const currencies = ['eur', 'usd']

    const create = async (formData: FormData) => {
        "use server";
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const currency = formData.get("currency") as string;
        const price = formData.get("price") as string;
        const stripe = new Stripe(process.env.STRIPE_TEST_KEY as string);

        const newStripeProduct = await stripe.products.create({
            name: title,
            description: description,
            default_price_data: {
                currency: currency,
                unit_amount: Number(price) * 100,
                recurring: {
                    interval: 'month'
                }
            },
            metadata: {
                clientId: session?.user.id
            }
          }, { stripeAccount: session.user.accountId });
        
        await prisma.subscription.create({
            data: {
                title: title,
                description: description,
                currency: currency,
                price: price,
                productId: newStripeProduct.id,
                priceId: newStripeProduct.default_price.toString(),
                clientId: session?.user.id
            }
        });

        redirect('/subscriptions');
    };

    return (
        <section className="w-full bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create a new subscription
                        </h1>
                        <form className="space-y-4 md:space-y-6" action={create}>
                            <div>
                                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                                <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Subscription title" required/>
                            </div>
                            <div>
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                <input type="text" name="description" id="description" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="About this subscription" required/>
                            </div>
                            <div>
                                <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Currency</label>
                                <select name="currency" id="currency" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    {currencies.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                <input type="text" name="price" id="price" placeholder="Price" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                            </div>
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>    
    )
}