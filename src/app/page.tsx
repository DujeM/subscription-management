import Sidebar from "@/components/sidebar";
import { auth } from "@/helpers/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import EmailDemoSuccessTemplate from "@/components/emailDemoSuccessTemplate";

export default async function Home() {
  const session = await auth();
  
  if (session) {
    redirect('/subscriptions');
  }

  const demoRequest = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const resend = new Resend(process.env.RESEND_KEY);

    await resend.emails.send({
      from: "subscription@excode.hr",
      to: [email],
      subject: "Subscribx early access",
      react: EmailDemoSuccessTemplate(),
    });

    await resend.emails.send({
      from: "subscription@excode.hr",
      to: ["duje@excode.hr"],
      subject: "New Subscribx demo request",
      react: EmailDemoSuccessTemplate(),
    });
  };

  return (
    <>
    <div className="navbar">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl">Subscribx</a>
      </div>
      <div className="navbar-end">
        <a className="btn btn-primary">Sign in</a>
      </div>
    </div>
    <div className="hero my-20">
      <div className="hero-content">
        <div>
          <h1 className="text-5xl font-bold">Elevate your business with online payments</h1>
          <p className="py-6">Start growing your business with subscription-based pricing model, let us focus on the tech, so you can focus on your product</p>
          <a href="#cta" className="btn btn-primary">Get Started</a>
        </div>
        <Image src={'/svg/online_payments.svg'} alt="Online payments" width={640} height={530} className="hidden md:block"/>
      </div>
    </div>
    <div className="bg-primary my-20 py-10">
      <h2 className="text-4xl font-bold text-center">Bloat free software, focused on revenue</h2>
      <p className="py-6 text-center">Out of the box monthly recurring revenue platform with customer driven experience</p>
    </div>
    <div className="flex justify-between flex-wrap max-w-7xl mx-auto my-20">
      <div className="card w-96 h-96 shadow-xl">
        <figure className="bg-white p-5 h-60">
          <Image src={'/svg/subscriptions.svg'} alt="Subscriptions" width={384} height={226} className="p-5" />
        </figure>
        <div className="card-body bg-primary rounded-es-2xl rounded-ee-2xl h-36">
          <h2 className="card-title">Subscriptions and customers</h2>
          <p>Easy setup, manage customers and their subscriptions</p>
        </div>
      </div>
      <div className="card w-96 h-96 shadow-xl">
        <figure className="bg-white p-5 h-60">
          <Image src={'/svg/reports.svg'} alt="Reports" width={384} height={226} className="p-5" />
        </figure>
        <div className="card-body bg-primary rounded-es-2xl rounded-ee-2xl h-36">
          <h2 className="card-title">Reports</h2>
          <p>Monitor your growth with detailed reports</p>
        </div>
      </div>
      <div className="card w-96 h-96 shadow-xl">
        <figure className="bg-white p-5 h-60">
          <Image src={'/svg/checkout.svg'} alt="Checkout" width={384} height={226} className="p-5" />
        </figure>
        <div className="card-body bg-primary rounded-es-2xl rounded-ee-2xl h-36">
          <h2 className="card-title">Integrated checkout</h2>
          <p>Integrated Stripe checkout, with invoices sent directly to your customers</p>
        </div>
      </div>
    </div>
    <div id="cta" className="hero bg-white">
      <div className="hero-content flex flex-between flex-wrap">
        <div className="text-center lg:text-left w-2/4">
          <h1 className="text-5xl font-bold text-slate-900">Early access</h1>
          <p className="py-6 text-slate-900">
          Take advantage of our limited-time offer. Book a demo now and gain early access! Clients that enroll during the early access will have an ability to influence core features. Ready to take the next step? Book a demo to see how we can help you achieve your goals.
          </p>
        </div>
        <div className="card bg-slate-900 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" action={demoRequest}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" name="email" placeholder="your@email.com" className="input input-bordered" required />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Book a demo</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <footer className="footer footer-center bg-base-300 text-base-content p-4">
      <aside>
        <p>Subscribx © {new Date().getFullYear()} - All right reserved by Excode</p>
      </aside>
    </footer>
    </>
  );
}
