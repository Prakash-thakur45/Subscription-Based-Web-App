import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';
import { upsertCustomerToMongoDB, upsertSubscriptionRecord } from '../../../lib/data';

export async function POST(req) {
    const session=await auth();
    // console.log("sesion",session)
  try {
    const { productId,currency,amount,priceId } = await req.json();
    //  console.log("priceID",priceId);
    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create a Razorpay order for payment
    const order = await instance.orders.create({
      amount: amount, // Replace with the product amount in paise
      currency:currency,
      receipt: `receipt_${Math.random() * 1000000}`,
      payment_capture: 1,
      notes: {
        // These notes will be added to your transaction. So you can search it within their dashboard.
        // Also, it's included in webhooks as well. So you can automate it.
        paymentFor: "Subscription",
        userId: session.user.id,
        priceId:priceId,
      },
    });


    // console.log("orderrr",order);
    // Create a Razorpay subscription
    const subscription = await instance.subscriptions.create({
      plan_id: productId, // Replace with your actual plan ID
      customer_notify: 1,
      total_count: 12, // Number of billing cycles
      start_at: Math.floor(Date.now() / 1000)+600, // Start time in seconds
      notes: {
                  customer_id:session.user.id,  // Add custom data like customer name
                  amount:amount,  // Add custom data like customer email
                  price_id:priceId,
             },
    });
    if(subscription)
    {
        await upsertCustomerToMongoDB(subscription);
        await upsertSubscriptionRecord(subscription);
    }

    // Return the Razorpay payment URL
    return NextResponse.json({
      id: order.id,
      short_url: subscription.short_url, // URL to redirect the user for payment
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Handle other HTTP methods
export function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
