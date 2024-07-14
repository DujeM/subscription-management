import Link from "next/link";
import { auth } from "@/helpers/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Stripe from 'stripe';
import Search from "@/components/search";

export default async function ProductsListPage({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
    };
  }) {
    const session = await auth();

    const products = await prisma.product.findMany({
        where: {
            AND: [
                {
                    clientId: session?.user.id,
                },
                {
                    OR: searchParams.query ? [
                        {
                            title: {
                                contains: searchParams.query,
                                mode: "insensitive",
                            }
                        },
                        {
                            description: {
                                contains: searchParams.query,
                                mode: "insensitive",
                            }
                        },
                        {
                            price: {
                                contains: searchParams.query,
                                mode: "insensitive",
                            }
                        },
                        {
                            currency: {
                                contains: searchParams.query,
                                mode: "insensitive",
                            }
                        },
                        
                    ] : []
                }
            ]
        }
    });

    const deleteProduct = async (formData: FormData) => {
        "use server"
        const productId = formData.get("productId") as string;
        const stripeProductId = formData.get("stripeProductId") as string;
        const scopeStripe = new Stripe(process.env.STRIPE_TEST_KEY as string);

        await prisma.product.delete({
            where: {
                id: productId
            }
        });

        await scopeStripe.products.update(stripeProductId, {
          active: false,
        }, { stripeAccount: session.user.accountId });

        revalidatePath('/products');
    }

    return (
        <>
            <section className="p-6 min-h-screen size-full">
                <div className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
                    <div className="px-4 mx-auto max-w-screen-2xl lg:px-12">
                        <h2 className="text-4xl mb-4 font-bold">Products</h2>
                        <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
                            <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                                <div className="w-full flex flex-col flex-shrink-0 space-y-3 md:flex-row lg:justify-between md:space-y-0 md:space-x-3">
                                    <Link href="/products/new" className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                        <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                        </svg>
                                        New product
                                    </Link>
                                    <Search placeholder="Search..."></Search>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Price</th>
                                            <th>Currency</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(sub => (
                                            <tr key={sub.id} className="hover:bg-gray-700 transition duration-150 ease-in-out">
                                                <td>{sub.title}</td>
                                                <td>{sub.description}</td>
                                                <td>{sub.price}</td>
                                                <td>{sub.currency.toUpperCase()}</td>
                                                <td className="flex">
                                                    <Link href={`/products/edit/${sub.id}`} className="cursor-pointer">
                                                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                                        </svg>
                                                    </Link>
                                                    <form action={deleteProduct}>
                                                        <input type="text" name="productId" id="productId" defaultValue={sub.id} hidden/>
                                                        <input type="text" name="stripeProductId" id="stripeProductId" defaultValue={sub.productId} hidden/>
                                                        <button type="submit" className="cursor-pointer">
                                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                                            </svg>
                                                        </button>
                                                    </form>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}