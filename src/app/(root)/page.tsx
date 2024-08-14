import Sidebar from "@/components/sidebar";
import { auth } from "@/helpers/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import EmailDemoSuccessTemplate from "@/components/emailDemoSuccessTemplate";
import DemoForm from "@/components/demoForm";
import emailDemoClient from "@/components/emailDemoClient";
import Stripe from "stripe";

export default async function Home() {
  const session = await auth();
  const includedFeatures = [
    'Create and send invoices',
    'Integrated Stripe checkout',
    'Manage products and services',
    'Subscription-based pricing model',
    'Influence core features while in early access',
    'Contact the founder directly with any issues',
  ];

  const demoRequest = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const resend = new Resend(process.env.RESEND_KEY);

    try {
      await resend.emails.send({
        from: "subscribx@excode.hr",
        to: [email],
        subject: "Subscribx early access",
        react: EmailDemoSuccessTemplate(),
      });
  
      await resend.emails.send({
        from: "subscribx@excode.hr",
        to: ["duje@excode.hr"],
        subject: "New Subscribx demo request",
        react: emailDemoClient({clientEmail: email}),
      });
    } catch (error) {
      return { error: error.message ? error.message : "Something went wrong!" };
    }
  };

  const handleStripeCheckout = async (FormData: FormData) => {
    "use server"
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    
    const checkout = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1PnfG0RrNnLvy6TVcuwKXXj9',
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: 'https://www.subscribx.com/success',
      automatic_tax: {enabled: true},
    });

    redirect(checkout.url);
  }

  return (
    <>
    <div className="navbar">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl">Subscribx</a>
      </div>
      <div className="navbar-end">
        <a href="/login" className="btn btn-primary text-white">Sign in</a>
      </div>
    </div>
    <div className="hero my-20">
      <div className="hero-content">
        <div>
          <h1 className="text-5xl font-bold">Elevate your business with online payments</h1>
          <p className="py-6">Start growing your business with direct customer invoicing, products management and subscription-based pricing model, let us focus on the tech, so you can focus on your business</p>
          <a href="#cta" className="btn btn-primary text-white">Get Started</a>
        </div>
        <Image src={'/svg/online_payments.svg'} alt="Online payments" width={640} height={530} className="hidden md:block"/>
      </div>
    </div>
    <div className="bg-primary-content my-20 py-10 px-4">
      <h2 className="text-4xl md:text-5xl font-bold text-center">Bloat free software, focused on revenue</h2>
      <p className="py-6 text-center">Out of the box monthly recurring revenue platform with customer driven experience</p>
    </div>
    <div className="flex p-5 gap-5 justify-center md:justify-between flex-wrap max-w-7xl mx-auto my-20">
      <div className="card w-96 h-96 shadow-xl">
        <figure className="bg-white p-5 h-60">
          <Image src={'/svg/checkout.svg'} alt="Checkout" width={384} height={226} className="p-5 h-64" />
        </figure>
        <div className="card-body p-2 gap-0 bg-primary rounded-es-2xl rounded-ee-2xl h-36 sm:p-5 sm:gap-2">
          <h2 className="card-title">Invoices and integrated checkout</h2>
          <p>Integrated Stripe checkout, with invoices sent directly to your customers</p>
        </div>
      </div>
      <div className="card w-96 h-96 shadow-xl">
        <figure className="bg-white p-5 h-60">
          <Image src={'/svg/subscriptions.svg'} alt="Subscriptions" width={384} height={226} className="p-5 h-64" />
        </figure>
        <div className="card-body p-2 gap-0 bg-primary rounded-es-2xl rounded-ee-2xl h-36 sm:p-5 sm:gap-2">
          <h2 className="card-title">Subscriptions and customers</h2>
          <p>Easy setup, manage customers and their subscriptions</p>
        </div>
      </div>
      <div className="card w-96 h-96 shadow-xl">
        <figure className="bg-white p-5 h-60">
          <Image src={'/svg/products.svg'} alt="Products" width={384} height={226} className="p-5 h-64" />
        </figure>
        <div className="card-body p-2 gap-0 bg-primary rounded-es-2xl rounded-ee-2xl h-36 sm:p-5 sm:gap-2">
          <h2 className="card-title">Product management</h2>
          <p>Create and manage your products and services</p>
        </div>
      </div>
    </div>
    <div id="cta" className="hero bg-primary-content">
      <div className="hero-content flex flex-between flex-wrap">
        <div className="text-center lg:text-left md:w-2/4">
          <h1 className="text-5xl font-bold text-white">Early access</h1>
          <p className="py-6 text-white">
          Take advantage of our limited-time offer. Book a demo now and gain early access! Clients that enroll during the early access will have an ability to influence core features. Ready to take the next step? Book a demo to see how we can help you achieve your goals.
          </p>
        </div>
        <div className="card bg-slate-900 w-full max-w-xs shrink-0 shadow-2xl">
          <DemoForm demoRequest={demoRequest} />
        </div>
      </div>
    </div>
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-5xl font-bold text-white sm:text-4xl">Simple no-tricks pricing</h2>
          <p className="mt-6 text-lg leading-8 text-white">
            Start growing your business today, no hidden costs, pay once own it forever
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-white">Lifetime membership</h3>
            <p className="mt-6 text-base leading-7 text-white">
              
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What’s included</h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-white sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">Pay once, own it forever</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">$349</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                </p>
                <form action={handleStripeCheckout}>
                  <button type="submit" className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get access</button>
                </form>
                <p className="mt-6 text-xs leading-5 text-gray-600">
                  Stripe transaction fees explained and visible at all times
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer className="footer footer-center bg-base-300 text-base-content p-4">
      <aside>
        <p>Subscribx © {new Date().getFullYear()} - All right reserved by Excode.hr</p>
      </aside>
    </footer>
    </>
  );
}
