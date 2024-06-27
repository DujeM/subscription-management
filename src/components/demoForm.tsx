"use client"
import toast from "react-hot-toast";

export default function DemoForm({demoRequest}) {
    async function submit(formData: FormData) {
        const result = await demoRequest(formData);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Demo request sent successfully!")
        }
    }

    return (
        <form className="card-body" action={submit}>
            <div className="form-control">
            <label className="label">
                <span className="label-text">Email</span>
            </label>
            <input type="email" name="email" placeholder="your@email.com" className="input input-bordered" required />
            </div>
            <div className="form-control mt-6">
            <button className="btn btn-primary text-white">Book a demo</button>
            </div>
        </form>
    );
}