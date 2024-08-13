import Link from "next/link";

export default async function PaymentSuccessPage() {

    return (
        <section className="w-full bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div className="flex flex-col gap-9">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 text-center mb-2.5 md:text-2xl dark:text-white">
                                Thank you for your purchase
                            </h1>
                            <p className="text-white text-center">Click below to create your account and start using the application, if you have any additional questions or need help setting up your account contact us directly at <a href="mailto:duje@excode.hr">duje@excode.hr</a></p>
                            <button className="btn btn-primary text-white">
                                <Link href="/client-register">Create an account</Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>    
    )
}