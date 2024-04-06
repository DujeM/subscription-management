export default function LoadingDots() {
    return (
        <section className="p-6 min-h-screen size-full flex flex-col justify-center	items-center">
            <div className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
                <span className="loading loading-dots loading-lg"></span>
            </div>
        </section>
    )
}