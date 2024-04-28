import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getUserByEmailToken(emailToken: string) {
    const user = await prisma.user.findUnique({
        where: {
            emailToken: emailToken
        }
    });

    return user;
}

export default async function UpdateSubscriptionPage({ params }: { params: { emailToken: string } }) {

    const user = await getUserByEmailToken(params.emailToken);
    let userUpdated = false;

    if (!user?.emailConfirmed) {
        await prisma.user.update({
            where: {
                id: user?.id
            },
            data: {
                emailConfirmed: true
            }
        });

        userUpdated = true;
    }

    return (
        <section className="w-full bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        {(user?.emailConfirmed || userUpdated) && 
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