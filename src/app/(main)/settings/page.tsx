import Link from "next/link";
import Stripe from "stripe";
import { auth } from "@/helpers/auth";
import { redirect, useSearchParams } from 'next/navigation'
import toast from "react-hot-toast";
import DisplayToast from "./displayToast";

export default async function SettingsPage({
    params,
    searchParams,
  }: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  })  {
    const session = await auth();
    let toastType = '', toastMessage = '';

    if (session === null) {
        redirect("auth/login");
    }

    const getStripeAccountLinks = async () => {
        "use server"
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

        const accountLinks = await stripe.accountLinks.create({
            account: session.user.accountId,
            refresh_url: 'http://localhost:3000/settings?status=reauth',
            return_url: 'http://localhost:3000/settings?status=return',
            type: 'account_onboarding',
        });

        redirect(accountLinks.url)
    }

    if (searchParams?.status && searchParams?.status === 'reauth') {
        await getStripeAccountLinks()
    }

    if (searchParams?.status && searchParams?.status === 'return') {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
        const stripeAccount = await stripe.accounts.retrieve(session.user.accountId);

        if (!stripeAccount.details_submitted) {
            toastType = 'error';
            toastMessage = "Stripe account creation is not completed, most of the features won't be available until then."
        } else {
            toastType = 'success';
            toastMessage = "Stripe account created successfully!"
        }
    }

    return (
        <section className="w-full bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Your account settings
                        </h1>
                        <ul>
                            <li>
                                <form action={getStripeAccountLinks}>
                                    <button type="submit" className="w-full flex items-center justify-between cursor-pointer p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        <span className="ms-3 whitespace-nowrap">Create your Stripe account</span>
                                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10 16 4-4-4-4"/>
                                        </svg>
                                    </button>
                                </form>
                            </li>
                            <li>
                                <Link href="https://dashboard.stripe.com/" target="_blank" className="flex items-center justify-between cursor-pointer p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <span className="flex-1 ms-3 whitespace-nowrap">Go to your Stripe dashboard</span>
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10 16 4-4-4-4"/>
                                    </svg>
                                </Link>
                            </li>
                            <li>
                                <Link href="https://stripe.com/pricing" target="_blank" className="flex items-center justify-between cursor-pointer p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <span className="flex-1 ms-3 whitespace-nowrap">Go to Stripe pricing table</span>
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10 16 4-4-4-4"/>
                                    </svg>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {toastType && toastMessage && <DisplayToast message={toastMessage} type={toastType}></DisplayToast>}    
        </section>
    );
}