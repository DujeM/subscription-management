import Image from "next/image";

export default async function Marketing() {
    return (
        <section className="w-full bg-gray-50 dark:bg-gray-900" style={{height: '1080px', width: '1080px', margin: '500px'}}>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0" style={{height: '1080px', width: '1080px'}}>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700" style={{height: '1080px', width: '1080px', maxWidth: 'unset'}}>
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-5xl font-bold">Elevate your business with online payments</h1>
                        <p className="py-6">Start growing your business with direct customer invoicing, products management and subscription-based pricing model, let us focus on the tech, so you can focus on your business</p>
                    </div>
                    <Image src={'/svg/online_payments.svg'} alt="Online payments" width={640} height={530} className="hidden md:block"/>
                </div>
            </div>
        </section>
    )
}