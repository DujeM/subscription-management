"use client"

import { Customer, Product } from "@prisma/client"
import { createInvoice } from "../actions";
import toast from "react-hot-toast";
import Multiselect from "@/components/multiselect";

export function Form({ customers, products}: { customers: Customer[], products: Product[]}) {
    async function createCustomerAction(formData: FormData) {
        const result = await createInvoice(formData);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Invoice created and sent to the customer!")
        }
    }

    return (
        <form className="space-y-4 md:space-y-6" action={createCustomerAction}>
            <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <input type="text" name="description" id="description" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Description displayed as memo in the invoice" required/>
            </div>
            <div>
                <label htmlFor="customer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Customer</label>
                <select name="customer" id="customer" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    {customers.map(c => <option key={c.id} value={c.customerId}>{c.fullName} - {c.email}</option>)}
                </select>
            </div>
            <div>
                <Multiselect options={products.map(p => { return { value: p.id, label: p.title }})} label={'Products'} defaultValue={''} placeholder={'Select one or more products'} toggle={false}/>
            </div>
            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create and send</button>
        </form>
    )
}