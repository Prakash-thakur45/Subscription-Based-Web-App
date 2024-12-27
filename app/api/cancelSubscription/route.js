import { deleteSubscriptionById } from '@/lib/action';
import { upsertSubscriptionRecord } from '@/lib/data';
import Razorpay from 'razorpay';

export async function POST(req) {
  const { subscription } = await req.json();
  // console.log("Subscription",subscription);
  const subscriptionId=subscription.id;

  const instance = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const response = await instance.subscriptions.cancel(subscriptionId);
      
        // console.log("response",response);
        if(response)
        {
          // await upsertSubscriptionRecord(response);
            await deleteSubscriptionById(response.id);
        }

    return new Response(JSON.stringify({ success: true, data: response }), {
      status: 200,
    });
  
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}
