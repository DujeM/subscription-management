"use client"

import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

interface TableRowProps {
    detailsLink: string;
}

export default function TableRow(props: PropsWithChildren<TableRowProps>) {
    const router = useRouter();

    return (
        <tr className="hover:bg-gray-700 cursor-pointer transition duration-150 ease-in-out" onClick={() => router.push(props.detailsLink)}>
            {props.children}
        </tr>
    );
}