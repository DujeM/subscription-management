import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getCustomerByEmailToken(emailToken: string) {
    const customer = await prisma.customer.findUnique({
        where: {
            emailToken: emailToken
        }
    });

    return customer;
}

export default async function UpdateSubscriptionPage({ params }: { params: { emailToken: string } }) {

    const customer = await getCustomerByEmailToken(params.emailToken);
    let customerUpdated = false;

    if (!customer?.emailConfirmed) {
        await prisma.customer.update({
            where: {
                id: customer?.id
            },
            data: {
                emailConfirmed: true
            }
        });

        customerUpdated = true;
    }

    return (
        <section className="w-full bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        {(customer?.emailConfirmed || customerUpdated) && 
                        <div>
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 text-center mb-2.5 md:text-2xl dark:text-white">
                                Email confirmed
                            </h1>
                            <p className="text-white text-center">Your email is ready to use, starting now subscription payment emails will be delivered based on the subscription model.</p>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </section>    
    )
}