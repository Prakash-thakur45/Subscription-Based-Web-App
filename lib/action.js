"use server";

import { revalidatePath } from "next/cache";
import { Customer, Price, Product, Subscription, User } from "./models";
import { connectToDb } from "./db";
import { signIn, signOut } from "./auth";
import bcrypt from "bcryptjs";
import Razorpay from "razorpay";
import { auth } from "./auth";


const TRIAL_PERIOD_DAYS = 0;

 const razorpayInstance = new Razorpay ({
  key_id:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET
});


export const fetchPlansFromRazorpay = async () => {
  try {
    const plans = await razorpayInstance.plans.all();
    // console.log('Fetched plans:', plans.items);
    return plans.items; // Return the array of plan objects
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
};



const upsertProductRecord = async () => {
  // console.log("Hello Auth",session)
  const plans=await fetchPlansFromRazorpay();
  // console.log("plans",plans);

  for(const plan of plans)
  {
    const product=plan.item;
    // console.log("hello",product);
    const productData = {
      id: plan.id,
      active: product.active,
      name: product.name,
      description: product.description || null,
      image: (product.images && product.images[0]) || null,
      metadata: product.metadata
    };
  
    try {
  
      connectToDb();
      const result = await Product.updateOne(
        {id: productData.id },
        { $set: productData },
        { upsert: true }
      );
      
      if (result.upsertedCount > 0) {
        console.log(`Product inserted: ${plan.id}`);
      } else {
        console.log(`Product updated: ${plan.id}`);
      }
    } catch (error) {
      throw new Error(`Product insert/update failed: ${error.message}`);
    }
  }
};


const upsertPriceRecord = async () => {
const plans=await fetchPlansFromRazorpay();
    
   for(const plan of plans)
   {
     const price=plan.item;
    const priceData = {
      id: plan.id,
      // product_id: typeof price.product === 'string' ? price.product : '',
      active: price.active,
      currency: price.currency,
      type: price.type,
      unit_amount: price.unit_amount ?? null,
      period:plan.period,
      interval:plan.interval,
    };
  
    try {
      connectToDb();
      const result = await Price.updateOne(
        { id: priceData.id },
        { $set: priceData },
        { upsert: true }
      );
  
      if (result.upsertedCount > 0) {
        console.log(`Price inserted: ${price.id}`);
      } else {
        console.log(`Price updated: ${price.id}`);
      }
    } catch (error) {
      throw new Error(`Price insert/update failed: ${error.message}`);
    }
   }

};


const deleteProductRecord = async (product) => {
  try {
    connectToDb();
    const result = await Product.deleteOne({ _id: product.id });
    if (result.deletedCount === 0) {
      throw new Error(`Product deletion failed: No product found with id ${product.id}`);
    }
    console.log(`Product deleted: ${product.id}`);
  } catch (error) {
    throw new Error(`Product deletion failed: ${error.message}`);
  }
};



const deletePriceRecord = async (price) => {
  try {
    connectToDb();
    const result = await Price.deleteOne({ _id: price.id });
    if (result.deletedCount === 0) {
      throw new Error(`Price deletion failed: No price found with id ${price.id}`);
    }
    console.log(`Price deleted: ${price.id}`);
  } catch (error) {
    throw new Error(`Price deletion failed: ${error.message}`);
  }
};



const deleteSubscriptionById = async (id) => {
  try {
    // Connect to MongoDB
    await connectToDb();

    // Delete the document by its _id
    const result = await Subscription.deleteOne({ id: id });

    if (result.deletedCount > 0) {
      console.log(`Subscription with id ${id} deleted successfully.`);
      return { success: true, message: `Subscription with id ${id} deleted successfully.` };
    } else {
      console.log(`No subscription found with id ${id}.`);
      return { success: false, message: `No subscription found with id ${id}.` };
    }
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return { success: false, message: `Error deleting subscription: ${error.message}` };
  }
};




const createCustomerInStripe = async (uuid, email) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error('Stripe customer creation failed.');

  connectToDb();
  const result = await customersCollection.insertOne({
    stripeCustomerId: newCustomer.id,
    uuid: uuid,
    email: email,
    createdAt: new Date()
  });

  if (!result.insertedId) throw new Error('MongoDB customer creation failed.');

  return newCustomer.id;
};


const createOrRetrieveCustomer = async ({ email, uuid }) => {
 
    connectToDb();
  // Check if the customer already exists in MongoDB
  const existingMongoCustomer = await Customer.findOne({ id: uuid });

  let stripeCustomerId;
  if (existingMongoCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingMongoCustomer.stripe_customer_id
    );
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    // If Stripe ID is missing from MongoDB, try to retrieve Stripe customer ID by email
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);
  if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');

  if (existingMongoCustomer && stripeCustomerId) {
    // If MongoDB has a record but doesn't match Stripe, update MongoDB record
    if (existingMongoCustomer.stripe_customer_id !== stripeCustomerId) {
      const updateResult = await customersCollection.updateOne(
        { id: uuid },
        { $set: { stripe_customer_id: stripeCustomerId, updatedAt: new Date() } }
      );

      if (!updateResult.modifiedCount) {
        throw new Error('MongoDB customer record update failed.');
      }
      console.warn(
        'MongoDB customer record mismatched Stripe ID. MongoDB record updated.'
      );
    }
    // If MongoDB has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
  } else {
    console.warn(
      'MongoDB customer record was missing. A new record was created.'
    );

    // If MongoDB has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomerToMongoDB(
      uuid,
      stripeIdToInsert
    );
    if (!upsertedStripeCustomer)
      throw new Error('MongoDB customer record creation failed.');

    return upsertedStripeCustomer;
  }
};


const copyBillingDetailsToCustomer = async (uuid, payment_method) => {
  const customer = payment_method.customer;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;

  // Update Stripe customer
  await stripe.customers.update(customer, { name, phone, address });

  // Update MongoDB record
  connectToDb();

  const result = await User.updateOne(
    { id: uuid },
    {
      $set: {
        billing_address: { ...address },
        payment_method: { ...payment_method[payment_method.type] },
        updatedAt: new Date()
      }
    }
  );

  if (!result.modifiedCount) {
    throw new Error('Customer update failed.');
  }
};


const manageSubscriptionStatusChange = async (subscriptionId, customerId, createAction = false) => {

  // Get customer's UUID from mapping table
  const customerData = await Customer.findOne({ stripe_customer_id: customerId });

  if (!customerData) throw new Error('Customer lookup failed.');

  const { id: uuid } = customerData;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  });

  // Prepare subscription data for upsert
  const subscriptionData = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
    canceled_at: subscription.canceled_at ? toDateTime(subscription.canceled_at).toISOString() : null,
    current_period_start: toDateTime(subscription.current_period_start).toISOString(),
    current_period_end: toDateTime(subscription.current_period_end).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
    trial_start: subscription.trial_start ? toDateTime(subscription.trial_start).toISOString() : null,
    trial_end: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null
  };

  // Upsert the latest status of the subscription object
  const subscriptionsCollection = db.collection('subscriptions');
  const result = await Subscription.updateOne(
    { id: subscription.id },
    { $set: subscriptionData },
    { upsert: true }
  );

  if (!result.upsertedId && !result.modifiedCount) {
    throw new Error('Subscription insert/update failed.');
  }
  console.log(`Inserted/updated subscription [${subscription.id}] for user [${uuid}]`);

  // For a new subscription copy the billing details to the customer object
  if (createAction && subscription.default_payment_method && uuid) {
    await copyBillingDetailsToCustomer(uuid, subscription.default_payment_method);
  }
};





export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  deleteSubscriptionById,
};



export const handleGithubLogin = async () => {
  "use server";
  await signIn("github");
};

export const handleLogout = async () => {
  "use server";
  await signOut();
};


export const register = async (previousState, formData) => {
  const { username, email, password, passwordRepeat } =
    Object.fromEntries(formData);
  if (password !== passwordRepeat) {
    return { error: "Passwords do not match" };
  }

  try {
    connectToDb();

    const user = await User.findOne({ username });

    if (user) {
      return { error: "Username already exists" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("saved to db");

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const login = async (prevState, formData) => {
  const { email, password } = Object.fromEntries(formData);
  // console.log("object");
  try {
    await signIn("credentials", { email, password });
  } catch (err) {
    // console.log(err);
    if (err.message.includes("CredentialsSignin")) {
      return { error: "Invalid email or password" };
    }

    //  return {error:"something went wrong...!"}
    // throw err;
  }
};
