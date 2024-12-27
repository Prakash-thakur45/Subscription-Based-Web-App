import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";
import { auth } from "../../../../lib/auth";
import { Price } from "../../../../lib/models";

const instance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export async function GET(request, { params }) {
    const session=await auth();
    // console.log("sessionnn",session);

    const priceId =params.id; // Assuming you're passing the id as a URL parameter

    const priceData = await Price.findOne({ id: priceId });
    // console.log("priceData..",priceData);

    if (!priceData) {
      console.log("message: 'Price not found'")
    }
 
  // console.log("pricedata...",priceData);

  const payment_capture = 1;
  const amount =priceData.unit_amount; // amount in paisa. In our case it's INR 1
  const currency = priceData.currency;
  const options = {
    amount: amount.toString(),
    currency,
    receipt: shortid.generate(),
    payment_capture,
    notes: {
      // These notes will be added to your transaction. So you can search it within their dashboard.
      // Also, it's included in webhooks as well. So you can automate it.
      paymentFor: "Subscription",
      userId: session.user.id.toString(),
      productId:priceData.id.toString(),
      priceId:priceData._id.toString()
    },
  };

  const order = await instance.orders.create(options);
  return NextResponse.json({ msg: "success", order });
}


export async function POST(req) {
  const body = await req.json();

  return NextResponse.json({ msg: body });
}



