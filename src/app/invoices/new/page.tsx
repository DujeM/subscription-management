import { auth } from "@/helpers/auth";
import prisma from "@/lib/prisma";
import { Form } from "./form";

export default async function NewInvoicePage() {
    const session = await auth();

    const customers = await prisma.customer.findMany({
        where: {
            clientId: session?.user.id
        }
    });

    const products = await prisma.product.findMany({
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
                            Create a new invoice
                        </h1>
                        <Form customers={customers} products={products} />
                    </div>
                </div>
            </div>
        </section>    
    )
}