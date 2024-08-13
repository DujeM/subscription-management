"use client"

import { signOut } from "next-auth/react";

export default function Logout() {
    return (
        <span onClick={() => { signOut({callbackUrl: '/login'}); }} className="flex items-center p-2 cursor-pointer text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
            </svg>
            <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
        </span>
    );
}