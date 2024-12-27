import { cache } from 'react';
import { Customer, Price, Product, Subscription, User } from './models';
import { connectToDb } from './db';


export const getUser = cache(async (userId) => {
    const user = await User.findById(userId); // Assuming userId is provided and User is a mongoose model
    return user;
  });
  

  export const getSubscription = cache(async (userId) => {
    // console.log("user",userId);
    const subscription = await Subscription.findOne({
      user_id: userId,
      status: { $in: ['trialing', 'active','created'] }
    }).lean();

    if (subscription) {
      // Convert ObjectId to string and rename _id to subscription_id
      subscription.subscription_id = subscription._id.toString();
      delete subscription._id; // Remove the original _id field if needed
    }

    // .populate({
    //   path: 'price_id',
    //   populate: {
    //     path: 'product_id'
    //   }
    // })
    // .exec();
  
    return subscription;
  });
  
   const getProducts = cache(async () => {
    try{
    const plans = await Product.find({ active: true }).lean()

    // Convert _id to plan_id
    const convertedProducts = plans.map(plan => {
      plan.plan_id = plan._id.toString(); // Convert ObjectId to string and assign to plan_id
      delete plan._id; // Remove the original _id field if needed
      return plan;
    });
    
    const productIds = convertedProducts.map(convertedProduct => convertedProduct.id);

    const prices = await Price.find({
      id: { $in: productIds }
    }).lean();
    
    const convertedPrices = prices.map(price => {
      price.price_id = price._id.toString(); // Convert ObjectId to string and assign to plan_id
      delete price._id; // Remove the original _id field if needed
      return price;
    });
    // console.log("prices",prices);
    const productsWithPrices = convertedProducts.map(convertedProduct => {
      const productPrices =  convertedPrices.filter(convertedPrice => convertedPrice.id === convertedProduct.id);
      // console.log(`Prices:`, productPrices);
      return {
        ...convertedProduct,
          prices:productPrices
      };
    });

    // console.log("productsWithPrices",JSON.stringify(productsWithPrices,null,2));
    return productsWithPrices // Pass the modified plans to the client component


  
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        products: [], // Return an empty array if there's an error
      },
    };  }});



export {getProducts};

  export const getUserDetails = cache(async (userId) => {
    const userDetails = await User.findById(userId).exec();
    return userDetails;
  });
  

  const upsertSubscriptionRecord = async (subscription) => {

    // console.log("subscription..",subscription);
    // console.log("customer...",subscription.notes.customer_id)
    const subscriptionData = {
      id:subscription.id,
      user_id:subscription.notes.customer_id,
      quantity:subscription.quantity,
      price_id:subscription.notes.price_id,
      product_id:subscription.plan_id,
      current_period_start:subscription.start_at,
      current_period_end:subscription.end_at,
      ended_at:subscription.end_at,
      created:subscription.created_at,
      status:subscription.status,
      start_at:subscription.start_at,

    };
     await connectToDb();
    try {
      const result = await Subscription.updateOne(
        {id: subscriptionData.id },
        { $set: subscriptionData },
        { upsert: true }
      );
      
      if (result.upsertedCount > 0) {
        console.log(`Subscription inserted: ${subscription.id}`);
      } else {
        console.log(`Subscription updated: ${subscription.id}`);
      }
    } catch (error) {
      throw new Error(`Subscription insert/update failed: ${error.message}`);
    }
  }




  const upsertCustomerToMongoDB = async (subscription) => {
    const customerData = {
      id:subscription.notes.customer_id,
      // user_id:session.user.id,
    };
  
    try {
      connectToDb();
      const result = await Customer.updateOne(
        { id: customerData.id },
        { $set: customerData },
        { upsert: true }
      );
  
      if (result.upsertedCount > 0) {
        console.log(`Customer inserted: ${customerData.id}`);
      } else {
        console.log(`Customer updated: ${customerData.id}`);
      }
    } catch (error) {
      throw new Error(`MongoDB customer record creation failed: ${error.message}`);
    }
  };


  export {
    upsertSubscriptionRecord,
    upsertCustomerToMongoDB,
  }

  