"use client";

import { Button } from "../button";
import LogoCloud from "../LogoCloud";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { cn } from "../../../lib/utils";
import Razorpay from "razorpay";
import { fetchPlansFromRazorpay } from "../../../lib/action";
import { redirect } from "next/navigation";


const subscription = null;

const BillingInterval = "lifetime" | "yearly" | "monthly";

const Pricing =({ products,user }) => {

  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.period)
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState("monthly");
  const [priceIdLoading, setPriceIdLoading] = useState();
  const currentPath = usePathname();

  // const makePayment = async ({
  //   price,}) => {
  //   const timestamp = new Date().toISOString();

  //   const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  //   const data = await fetch(`http://localhost:3000/api/razorpay/${price.id}`);

  //   const { order } = await data.json();
  //   console.log("Order", order);

  //   const options = {
  //     key: key,
  //     name: "Prakash Thakur",
  //     currency: order.currency,
  //     amount: order.amount,
  //     order_id: order.id,
  //     description: "All the basics for starting a new business!",
  //     // image: logoBase64,
  //     handler: async function (response) {
  //       console.log("response", response);
  //       // if (response.length==0) return <Loading/>;
  //       // console.log(response);

  //       const data = await fetch("http://localhost:3000/api/paymentverify", {
  //         method: "POST",
  //         // headers: {
  //         //   // Authorization: 'YOUR_AUTH_HERE'
  //         // },
  //         body: JSON.stringify({
  //           razorpay_payment_id: response.razorpay_payment_id,
  //           razorpay_order_id: response.razorpay_order_id,
  //           razorpay_signature: response.razorpay_signature,
  //         }),
  //       });

  //       const res = await data.json();

  //       console.log("response verify==", res);

  //       if (res?.message == "success") {
  //         //       console.log("redirected.......")
  //         router.push(
  //           "/paymentsuccess?paymentid=" + response.razorpay_payment_id
  //         );
  //       }

  //       // Validate payment at server - using webhooks is a better idea.
  //       alert(response.razorpay_payment_id);
  //       alert(response.razorpay_order_id);
  //       alert(response.razorpay_signature);
  //     },
  //     prefill: {
  //       name: "",
  //       email: "prakashthakur72661@gmailcom",
  //       contact: "000000000",
  //     },
  //   };

  //   const paymentObject = await new window.Razorpay(options);
  //   paymentObject.open();

  //   paymentObject.on("payment.failed", function (response) {
  //     alert("Payment failed. Please try again. Contact support for help");
  //   });

  // }

  const handleSubscribe = async ({ price }) => {
    setPriceIdLoading(price.id);
    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/login');
    }

    // Call your API route to create the subscription in Razorpay
    // console.log("price",price);
    const response = await fetch("/api/createSubscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: price.id,
        amount: price.unit_amount,
        currency: price.currency,
        priceId: price.price_id,
      }),
    });

    const data = await response.json();

    // Redirect the user to Razorpay checkout page for payment
    if (data.id) {
      window.location.href = data.short_url; // Assuming Razorpay returns a checkout URL
    }
    setPriceIdLoading(undefined);
  };

  if (!products.length) {
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{" "}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
        <LogoCloud />
      </section>
    );
  } else {
    return (
      <>
        <section className="bg-black">
          <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
            <div className="sm:flex sm:flex-col sm:align-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
                Pricing Plans
              </h1>
              <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
                Start building for free, then add a site plan to go live.
                Account plans unlock additional features.
              </p>
              <div className="relative self-center mt-6 bg-zinc-900 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
                {intervals.includes("monthly") && (
                  <button
                    onClick={() => setBillingInterval("monthly")}
                    type="button"
                    className={`${
                      billingInterval === "monthly"
                        ? "relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white"
                        : "ml-0.5 relative w-1/2 border border-transparent text-zinc-400"
                    } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                  >
                    Monthly billing
                  </button>
                )}
                {intervals.includes("yearly") && (
                  <button
                    onClick={() => setBillingInterval("yearly")}
                    type="button"
                    className={`${
                      billingInterval === "yearly"
                        ? "relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white"
                        : "ml-0.5 relative w-1/2 border border-transparent text-zinc-400"
                    } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                  >
                    Yearly billing
                  </button>
                )}
              </div>
            </div>
            <div className="mt-12 space-y-0 sm:mt-16 flex flex-wrap justify-center gap-12 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
              {products.map((product) => {
                const price = product?.prices?.find(
                  (price) => price.period === billingInterval
                );
                if (!price) return null;
                const priceString = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: price.currency,
                  minimumFractionDigits: 0,
                }).format((price.unit_amount || 0) / 100);
                return (
                  <div
                    key={product.id}
                    className={cn(
                      "flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900",
                      {
                        "border border-pink-500": subscription
                          ? product.name ===
                            subscription?.prices?.products?.name
                          : product.name === "Enterprice",
                        // 'flex-1':
                        // 'basis-1/3',
                        // 'max-w-xs':
                      }
                    )}
                  >
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold leading-6 text-white">
                        {product.name}
                      </h2>
                      <p className="mt-4 text-zinc-300">
                        {product.description}
                      </p>
                      <p className="mt-8">
                        <span className="text-5xl font-extrabold white">
                          {priceString}
                        </span>
                        <span className="text-base font-medium text-zinc-100">
                          /{billingInterval}
                        </span>
                      </p>
                      <Button
                        variant="outline"
                        type="button"
                        /*loading={priceIdLoading === price.id}*/
                        disabled={priceIdLoading===price.id}
                        onClick={() =>
                          // makePayment({ price })
                          handleSubscribe({ price })
                        }
                        className="block w-full py-2 mt-8 text-sm font-semibold text-center text-black rounded-md hover:bg-zinc-500"
                      >
                        {priceIdLoading===price.id ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin h-5 w-5 mr-2 text-black"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                              ></path>
                            </svg>
                            Subscribe...
                          </div>
                        ) : (
                          "Subscribe"
                        )}
                        {/* {subscription ? "Manage" : "Subscribe"} */}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <LogoCloud />
          </div>
        </section>
      </>
    );
  }
};

export default Pricing;
