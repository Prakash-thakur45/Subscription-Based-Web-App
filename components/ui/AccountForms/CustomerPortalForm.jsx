"use client"
import { Button } from '../button';
// import { useRouter, usePathname } from 'next/navigation';
import { useState,useEffect } from 'react';
import Link from 'next/link';
import Card from '../Card/Card';
import Razorpay from 'razorpay';
import { upsertSubscriptionRecord } from '@/lib/data';

  const CustomerPortalForm=({ subscription })=> {
  // const router = useRouter();
  // const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cancelSubscription = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/cancelSubscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription}),
      });
  
      const data = await response.json();
      
      if (data.success) {
        console.log('Subscription cancelled:', data.data);
        window.location.reload();
      } else {
        console.error('Error cancelling subscription:', data.error);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      title="Your Plan"
      description={
        subscription
          ? `You are currently on the ${subscription?.product_id} plan.`
          : 'You are not currently subscribed to any plan.'
      }
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">Manage your subscription on Razorpay.</p>
          <Button
            variant="outline"
            type="button"
            onClick={()=>cancelSubscription(subscription)}
            disabled={isSubmitting}
            // loading={isSubmitting}
            className="block w-auto py-2 mt-8 text-sm font-semibold text-center text-black rounded-md hover:bg-zinc-500"
          >
        {isSubmitting ? (
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
          Cancelling...
        </div>
      ) : (
        'Cancel Subscription'
      )}          </Button>
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        {subscription ? (
          // `${subscriptionPrice}/${subscription?.price_id}`
          `Status : ${subscription?.status}`

        ) : (
          <Link href="/">Choose your plan</Link>
        )}
      </div>
    </Card>
  );
}

export default CustomerPortalForm;