"use client"
import { useRef, useEffect } from "react";
import toast from "react-hot-toast";

export default function DisplayToast(props: { message: string, type: string }) {
    const count = useRef(null);

    useEffect(() => {
        if (count.current == null && props.type) {
            if (props.type === 'success') {
                toast.success(props.message)
            } else if (props.type === 'error') {
                toast.error(props.message)
            }        
        }
        return () => { count.current = 1; }
      }, []);

    return (<></>);
}