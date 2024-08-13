import { auth } from "@/helpers/auth";
import Form from "./form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await auth();

    if (session && session.user) {
        redirect('/');
    }

    return (
        <section className="w-full bg-primary-content">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-slate-900 rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 border-slate-900">
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