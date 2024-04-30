import { auth } from "@/helpers/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

async function get(id: string) {
    const customer = await prisma.customer.findUnique({
        where: {
            id: id
        }
    });

    return customer;
}

export default async function UpdateSubscriptionPage({ params }: { params: { id: string } }) {
    const session = await auth();

    const customer = await get(params.id);

    const subscriptions = await prisma.subscription.findMany({
        where: {
            clientId: session?.user.id
        }
    });

    const update = async (formData: FormData) => {
        "use server";
        const fullName = formData.get("fullName") as string;
        const email = formData.get("email") as string;
        const address = formData.get("address") as string;
        const phone = formData.get("phone") as string;
        const subscription = formData.get("subscription") as string;

        await prisma.customer.update({
            where: {
                id: params.id
            },
            data: {
                fullName: fullName,
                email: email,
                address: address,
                phone: phone,
                emailConfirmed: false,
                clientId: session?.user.id,
                subscriptionId: subscription
            }
        });

        redirect('/customers');
    };

    return (
        <section className="w-full bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Update customer
                        </h1>
                        <form className="space-y-4 md:space-y-6" action={update}>
                            <div>
                                <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full name</label>
                                <input type="text" name="fullName" id="fullName" defaultValue={customer?.fullName} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your full name" required/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="email" name="email" id="email" defaultValue={customer?.email} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your email" required/>
                            </div>
                            <div>
                                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                <input type="text" name="address" id="address" defaultValue={customer?.address ?? ''} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your address"/>
                            </div>
                            <div>
                                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                                <input type="text" name="phone" id="phone" defaultValue={customer?.phone ?? ''} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your phone number"/>
                            </div>
                            <div>
                                <label htmlFor="subscription" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subscription</label>
                                <select name="subscription" id="subscription" defaultValue={customer?.subscriptionId ?? ''} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    {subscriptions.map(sub => <option key={sub.id} value={sub.id}>{sub.title}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>    
    )
}