"use client"
import toast from "react-hot-toast";

type Props = {
    deleteFn: (data: FormData) => Promise<{
        error: any;
    }>,
    itemId: string,
    stripeItemId: string,
    itemIdName: string;
    stripeIdName: string;
  }

export default function DeleteAction({deleteFn, itemId, stripeItemId, itemIdName, stripeIdName}: Props) {
    async function deleteFnAction(formData: FormData) {
        const result = await deleteFn(formData);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Item deleted successfully!")
        }
    }

    return (
            <>
                <div className="cursor-pointer" onClick={() => (document.getElementById('delete_modal') as HTMLDialogElement).showModal() }>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                    </svg>
                </div>
                <dialog id="delete_modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-center">Are you sure you want to delete this item?</h3>
                        <p className="py-4 text-center">Click delete to proceed or click cancel below to close.</p>
                        <div className="modal-action justify-center gap-4">
                        <form action={deleteFnAction}>
                            <input type="text" name={itemIdName} id={itemIdName} defaultValue={itemId} hidden/>
                            <input type="text" name={stripeIdName} id={stripeIdName} defaultValue={stripeItemId} hidden/>
                            <button type="submit" className="btn btn-error">Delete</button>
                        </form>
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                        </div>
                    </div>
                </dialog>
            </>
    )
}