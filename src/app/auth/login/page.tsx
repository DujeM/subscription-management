import { auth } from "@/helpers/auth";
import Form from "./form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await auth();

    if (session && session.user) {
        redirect('/');
    }

    return (
        <section className="w-full bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <Form/>
                    </div>
                </div>
            </div>
        </section>
    )
}