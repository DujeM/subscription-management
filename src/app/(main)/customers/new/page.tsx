"use server"

import { auth } from "@/helpers/auth";
import prisma from "@/lib/prisma";
import Form from "./form";
import { redirect } from "next/navigation";

export default async function NewCustomerPage() {
    const session = await auth();

    if (session === null) {
        redirect("auth/login");
    }

    const subscriptions = await prisma.subscription.findMany({
        where: {
            clientId: session?.user.id
        }
    });

    return (
        <section className="w-full bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create a new customer
                        </h1>
                        <Form selectSubscriptions={subscriptions.map(s => { return { value: s.id, label: s.title }})} />
                    </div>
                </div>
            </div>
        </section>    
    )
}