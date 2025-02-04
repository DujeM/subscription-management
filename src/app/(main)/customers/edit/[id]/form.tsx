"use client"

import { updateCustomer } from "@/app/(main)/customers/actions";
import Multiselect from "@/components/multiselect";
import toast from "react-hot-toast";

export default function Form({selectSubscriptions, customer}) {
    async function updateCustomerAction(formData: FormData) {
        const result = await updateCustomer(formData, customer);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Customer updated successfully!")
        }
    }
    
    return (
        <form className="space-y-4 md:space-y-6" action={updateCustomerAction}>
            <div>
                <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full name</label>
                <input type="text" name="fullName" id="fullName" defaultValue={customer?.fullName} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your full name" required/>
            </div>
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input type="email" name="email" id="email" defaultValue={customer?.email} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your email" required/>
            </div>
            <div>
                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                <input type="text" name="address" id="address" defaultValue={customer?.address ?? ''} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your address"/>
            </div>
            <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                <input type="text" name="phone" id="phone" defaultValue={customer?.phone ?? ''} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your phone number"/>
            </div>
            <div>
                <Multiselect options={selectSubscriptions} label={'Subscriptions'} defaultValue={customer.subscriptions.length ? customer.subscriptions.map(s => s.id).join(',') : null} placeholder={'Assign subscriptions'} toggle={true} toggleLabel="Enable subscriptions?" toggleValue={!!customer.subscriptions.length}/>
            </div>
            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update</button>
        </form>
    );
}