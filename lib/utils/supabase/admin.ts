import { toDateTime } from '@/lib/utils/helpers';
import { stripe } from '@/lib/utils/stripe/config';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import type { Database, Tables, TablesInsert } from '@/types_db';
import { supabase } from '@/lib/supabaseClient';

type Product = Tables<'products'>;
type Price = Tables<'prices'>;

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!


const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata
  };

  const { error: upsertError } = await supabase
    .from('products')
    .upsert([productData]);
  if (upsertError)
    throw new Error(`Product insert/update failed: ${upsertError.message}`);
  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3
) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    currency: price.currency,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS
  };

  const { error: upsertError } = await supabase
    .from('prices')
    .upsert([priceData]);

  if (upsertError?.message.includes('foreign key constraint')) {
    if (retryCount < maxRetries) {
      console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await upsertPriceRecord(price, retryCount + 1, maxRetries);
    } else {
      throw new Error(
        `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`
      );
    }
  } else if (upsertError) {
    throw new Error(`Price insert/update failed: ${upsertError.message}`);
  } else {
    console.log(`Price inserted/updated: ${price.id}`);
  }
};

const deleteProductRecord = async (product: Stripe.Product) => {
  const { error: deletionError } = await supabase
    .from('products')
    .delete()
    .eq('id', product.id);
  if (deletionError)
    throw new Error(`Product deletion failed: ${deletionError.message}`);
  console.log(`Product deleted: ${product.id}`);
};

const deletePriceRecord = async (price: Stripe.Price) => {
  const { error: deletionError } = await supabase
    .from('prices')
    .delete()
    .eq('id', price.id);
  if (deletionError) throw new Error(`Price deletion failed: ${deletionError.message}`);
  console.log(`Price deleted: ${price.id}`);
};

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
  const { error: upsertError } = await supabase
    .from('customers')
    .upsert([{ id: uuid, stripe_customer_id: customerId }]);

  if (upsertError)
    throw new Error(`Supabase customer record creation failed: ${upsertError.message}`);

  return customerId;
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  console.log('create customer');
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error('Stripe customer creation failed.');

  return newCustomer.id;
};

const createOrRetrieveCustomer = async ({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) => {
  // Check if the customer already exists in Supabase
  console.log("uuid:",uuid)
  const { data: existingSupabaseCustomer, error: queryError } =await supabase
      .from('customers')
      .select('*')
      .eq('id', uuid)
      .maybeSingle();
  console.log("===existingSupabaseCustomer===:",existingSupabaseCustomer);
  if (queryError) {
    throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
  }

  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  let stripeCustomerId: string | undefined;
  if (existingSupabaseCustomer?.stripe_customer_id) {
    console.log("existingSupabaseCustomer");
    try{
      const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.stripe_customer_id
      );
      stripeCustomerId = existingStripeCustomer.id;
    }
    catch(error){
      console.log("stripe.customers.retrieve error!",error);
    }
    
    console.log("stripeCustomerId:",stripeCustomerId)
  } else {
    console.log("SupabaseCustomer is not exit");
    // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
      console.log("===stripeCustomerId===",stripeCustomerId);
  }

  const stripeIdToInsert = stripeCustomerId
  ? stripeCustomerId
  : await createCustomerInStripe(uuid, email);
  console.log("stripeIdToInsert:",stripeIdToInsert)
  if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');
  // If still no stripeCustomerId, create a new customer in Stripe
  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabase
        .from('customers')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', uuid);

      if (updateError){
        console.log("===updateError===:",updateError.message)
        throw new Error(
          `Supabase customer record update failed: ${updateError.message}`
        );
      }
       
      console.warn(
        `Supabase customer record mismatched Stripe ID. Supabase record updated.`
      );
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
  } else {
    console.warn(
      `Supabase customer record was missing. A new record was created.`
    );

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert
    );
    if (!upsertedStripeCustomer)
      throw new Error('Supabase customer record creation failed.');

    return upsertedStripeCustomer;
  }
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  const { error: updateError } = await supabase
    .from('users')
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] }
    })
    .eq('id', uuid);
  if (updateError) throw new Error(`Customer update failed: ${updateError.message}`);
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  type:string
) => {
  let createAction=false
  if(type=='customer.subscription.created'|| 'checkout.session.completed'){
      createAction=true
  }
  else{
    createAction=false
  }

  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabase
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (noCustomerError)
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`);

  const { id: uuid } = customerData!;
  console.log("uuid:",uuid)

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData: TablesInsert<'subscriptions'> = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    //TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscription.current_period_start
    ).toISOString(),
    current_period_end: toDateTime(
      subscription.current_period_end
    ).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null
  };


  const { error: upsertError } = await supabase
    .from('subscriptions')
    .upsert([subscriptionData]);
  if (upsertError)
    throw new Error(`Subscription insert/update failed: ${upsertError.message}`);
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  );


  // //做newapi请求逻辑，通过用户的accesstoken去更新令牌
  // if(type=='customer.subscription.create' &&subscription.items.data[0].plan.amount){
  //   createCustomerToken(uuid,subscription.items.data[0].plan.amount,subscription.current_period_end.toString(),subscription.items.data[0].price.id)
  // }

  //做newapi请求逻辑，通过用户的accesstoken去更新令牌
 if((type=='customer.subscription.updated' )&&subscription.items.data[0].plan.amount && subscription.cancel_at_period_end===false){
    await updateCustomerToken(
      uuid,
      subscription.items.data[0].plan.amount,
      subscription.current_period_end,
      subscription.items.data[0].price.id
    )
  }
  else if(type=='customer.subscription.deleted' && subscription.items.data[0].plan.amount){
    await freeCustomerToken(uuid)
  }


  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    console.log('copyBillingDetailsToCustomer')
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
};
//给用户免费令牌
const freeCustomerToken = async (
  user_id: string,
) => {
  try{
    //查询accessToken和token_name
    let { data: newApi_user, error } = await supabase
    .from('newapi_user')
    .select('*')
    .eq('id',user_id)
    .single()
    if(error){
      console.log('search newApiUser Error!',error);
    }
    else{
      if(newApi_user){
        const { data, error } = await supabase
          .from('newapi_user')
          .update({ token_key_usedNow: newApi_user.free_token.token })
          .eq('id',user_id)
      }
    }
  }
  catch(err){
    console.log(err);
  }
}

//更新用户newapi令牌
const updateCustomerToken = async (
  user_id: string,
  amount:number,
  current_period_end:number,
  price_id:string
) => {
  //通过userid找到令牌的key

  try{
    //查询accessToken和token_name
    let { data: newApi_user, error } = await supabase
    .from('newapi_user')
    .select('accessToken,token_key_usedNow')
    .eq('id',user_id)
    .single()

    if(error){
      console.log('search newApiUser Error!',error);
    }
    else{
      if(newApi_user){
        let body={}
        let { data: price, error:priceError } = await supabase
          .from('prices')
          .select('product_id')
          .eq('id', price_id)
          .single()
          if(priceError){
            console.log('search price Error!',priceError);
          }
          else if(price){
            let { data: product, error:productError } = await supabase
            .from('products')
            .select('name')
            .eq('id', price.product_id)
            .single()
            if(productError){
              console.log('search product Error!',productError);
            }
            else if(product){
              console.log("name:",product.name)
              //更新额度和时间
              body={
                accessToken:newApi_user.accessToken,
                keyword:product.name,
                token:newApi_user.token_key_usedNow,
                remain_quota: 5000*amount,
                expired_time: current_period_end,
              } 
            }
          }
        
        const response = await fetch('http://localhost:3000/api/createToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if(!data.success){
          console.log("createToken error",data.message)
        }
        else{
          //创建新的令牌后，插入一条新的令牌信息给user_key表
          console.log("createToken success",data.data)
          const { data:user_key, error } = await supabase
            .from('user_key')
            .insert([
              { id: data.data, price_id },
            ])
            .select()
            if(error){
              console.log("user_key error!",error);
            }
            if(user_key){//更新用户当前使用的key
              const { data, error } = await supabase
                .from('newapi_user')
                .update({ token_key_usedNow: user_key[0].id})
                .eq('id', user_id)
                .select()
            }
        }  
      }   
    }
  }
  catch(err){
    console.log(err)
  }
}

export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange
};
