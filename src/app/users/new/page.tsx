import { auth } from "@/helpers/auth";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { User } from "next-auth";
import { redirect } from "next/navigation";
import EmailVerifyTemplate from '@/components/emailVerifyTemplate';
import { Resend } from 'resend';


export default async function NewUserPage() {
    const session = await auth();

    const subscriptions = await prisma.subscription.findMany({
        where: {
            clientId: session?.user.id
        }
    });

    const create = async (formData: FormData) => {
        "use server";
        const fullName = formData.get("fullName") as string;
        const email = formData.get("email") as string;
        const address = formData.get("address") as string;
        const phone = formData.get("phone") as string;
        const subscription = formData.get("subscription") as string;
        const resend = new Resend(process.env.RESEND_KEY);

        const newUser = await prisma.user.create({
            data: {
                fullName: fullName,
                email: email,
                address: address,
                phone: phone,
                emailConfirmed: false,
                emailToken: randomUUID(),
                clientId: session?.user.id,
                subscriptionId: subscription
            },
            include: {
                subscription: true,
                client: true
            }
        });

        await resend.emails.send({
            from: 'subscription@excode.hr',
            to: [email],
            subject: 'Please confirm your email',
            react: EmailVerifyTemplate({ fullName: newUser.fullName, clientName: newUser.client?.name, subscription: newUser.subscription?.title, emailToken: newUser.emailToken })
        });

        redirect('/users');
    };

    return (
        <section className="w-full bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create a new user
                        </h1>
                        <form className="space-y-4 md:space-y-6" action={create}>
                            <div>
                                <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full name</label>
                                <input type="text" name="fullName" id="fullName" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your full name" required/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your email" required/>
                            </div>
                            <div>
                                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                <input type="text" name="address" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your address"/>
                            </div>
                            <div>
                                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                                <input type="text" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your phone number"/>
                            </div>
                            <div>
                                <label htmlFor="subscription" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subscription</label>
                                <select name="subscription" id="subscription" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    {subscriptions.map(sub => <option key={sub.id} value={sub.id}>{sub.title}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>    
    )
}