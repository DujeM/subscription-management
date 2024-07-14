"use client"

import toast from "react-hot-toast";
import { updateSubscription } from "../../actions";

export default function Form({sub}) {
    const currencies = ['eur', 'usd']

    async function updateSubscriptionAction(formData: FormData) {
        const result = await updateSubscription(formData, sub);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Subscription updated successfully!")
        }
    }
    
    return (
        <form className="space-y-4 md:space-y-6" action={updateSubscriptionAction}>
            <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                <input type="text" name="title" id="title" defaultValue={sub?.title} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Subscription title" required/>
            </div>
            <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <input type="text" name="description" id="description" defaultValue={sub?.description} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="About this subscription" required/>
            </div>
            <div>
                <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Currency</label>
                <select name="currency" id="currency" defaultValue={sub.currency} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed" disabled>
                    {currencies.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                <input type="text" name="price" id="price" defaultValue={sub?.price} placeholder="Price" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed" disabled/>
            </div>
            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update</button>
        </form>
    );
}