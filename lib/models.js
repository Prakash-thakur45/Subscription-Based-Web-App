import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },

    billing_address: { 
      type: mongoose.Schema.Types.Mixed,
      default: null },

    payment_method: { 
      type: mongoose.Schema.Types.Mixed,
      default: null },

    password: {
      type: String,
    },

  },
  { timestamps: true }
);


const productSchema = new mongoose.Schema(
  {
    active: {
       type: Boolean,
       default: null 
       },

    description: { 
       type: String,
       default: null
       },

       id: { 
       type: String,
       default: null,
       required:true
       },

    image: { 
      type: String, 
      default: null 
    },

    metadata: { 
      type: mongoose.Schema.Types.Mixed,
      default: null 
    },

    name: { 
      type: String,
      default: null
     },
   }, 

   { timestamps: true }
  );

  const priceSchema = new mongoose.Schema(
    {
      active: { 
        type: Boolean,
        default: null 
      },

      currency: { 
        type: String,
        default: null
       },

      id: {
         type: String, 
         required: true 
        },

      period: {
         type: String, 
         enum: ["daywise", "weekly", "monthly", "yearly"],
         required: true, 
         default: null 
        },

      interval: { 
        type: Number, 
        default: null 
      },

      // product_id: { 
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: 'Product',
      //   default: null 
      // },

      type: {
         type: String,
         enum: ["one_time", "recurring","plan"],
         default: null 
        },
        
      unit_amount: {
         type: Number, 
         default: null },
    },

    { timestamps: true }
  );
  
  const subscriptionSchema = new mongoose.Schema(
    {
      cancel_at: { type: String, default: null },
      cancel_at_period_end: { type: Boolean, default: null },
      canceled_at: { type: String, default: null },
      created: { type: String, required: true },
      current_period_end: { type: String, required: true },
      current_period_start: { type: String, required: true },
      ended_at: { type: String, default: null },
      id: { type: String, required: true },
      metadata: { type: mongoose.Schema.Types.Mixed, default: null },
      price_id: { type:String, default: null },
      product_id: { type:String, default: null },
      quantity: { type: Number, default: null },
      status: { type: String, enum: ["trialing", "active", "canceled", "incomplete", "incomplete_expired", "past_due", "unpaid", "paused","completed","created"], default: null },
      trial_end: { type: String, default: null },
      trial_start: { type: String, default: null },
      user_id: { type:String, default: null },
      start_at:{ type: String, default: null}
    },
      { timestamps: true }
  );
  
  const customerSchema = new mongoose.Schema(
    {
      id: { 
        type: String, 
        required: true
       },

      User_id: { 
        type: String,
        default: null
         },

    }, 
       { timestamps: true }
  );
  
export const Customer = mongoose.models?.Customer || mongoose.model('Customer', customerSchema); 
export const Subscription = mongoose.models?.Subscription|| mongoose.model('Subscription', subscriptionSchema);
export const Price =mongoose.models?.Price|| mongoose.model('Price', priceSchema);
export const Product = mongoose.models?.Product || mongoose.model('Product', productSchema);
export const User = mongoose.models?.User || mongoose.model("User", userSchema);
