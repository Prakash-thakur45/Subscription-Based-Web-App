
import { NextResponse } from 'next/server';
// import { buffer } from 'micro';
import Razorpay from 'razorpay';
import { upsertSubscriptionRecord } from '../../../lib/data';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser to handle raw requests
  },
};

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  const body=await req.json();

  try {
         
    const receivedSignature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.WEBHOOK_SECRET;

    // Validate the webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (receivedSignature !== expectedSignature) {
      return new Response(JSON.stringify({ status: 'invalid signature' }), { status: 400 });
    }

    if (body.event === 'subscription.activated') {
      const subscription = body.payload.subscription.entity;

     if(subscription)
     {
       await upsertSubscriptionRecord(subscription);
     }

      return NextResponse.json({ message: 'Subscription updated to active' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Event not handled' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
