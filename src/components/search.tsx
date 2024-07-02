"use client"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface SearchProps {
    placeholder: string;
}

export default function Search(props: SearchProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);

        if (term) {
          params.set('query', term);
        } else {
          params.delete('query');
        }

        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <label className="input input-bordered flex items-center gap-2">
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
            </svg>
            <input type="text" className="grow" placeholder={props.placeholder} 
            onChange={(e) => { handleSearch(e.target.value); }} 
            defaultValue={searchParams.get('query')?.toString()}/>
        </label>
    );
}