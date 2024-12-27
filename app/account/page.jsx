
import CustomerPortalForm from "../../components/ui/AccountForms/CustomerPortalForm";
import EmailForm from "../../components/ui/AccountForms/EmailForm";
import NameForm from "../../components/ui/AccountForms/NameForm";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import { getSubscription } from "../../lib/data";
import { json } from "stream/consumers";




const Account=async ()=> {

  const user =await auth();
  const subscription=await getSubscription(user.user.id);
  // console.log("subscription...",subscription)
  if(!user){
              return redirect('/login')
  }

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            We partnered with Razorpay for a simplified billing.
          </p>
        </div>
      </div>
      <div className="p-4">
        <CustomerPortalForm subscription={subscription} />
        <NameForm userName='' />
        <EmailForm userEmail='' />
      </div>
    </section>
  );
}


export default Account;