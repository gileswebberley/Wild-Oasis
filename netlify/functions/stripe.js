// const stripe = require('stripe')(process.env.STRIPE_SECRET);
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET);
// const currentHostUrl = 'http://localhost:8888';//dev with netlify cli
const currentHostUrl = 'https://wild-oasis-demo.netlify.app';

export default async function handler(req, context) {
  const reqBody = await req.json();
  // console.log(`request body - ${JSON.stringify(reqBody)}`);
  const { product, cost } = reqBody;
  console.log(`cabinName from stripe - ${product}`);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'Your stay at our cabin called ' + decodeURI(product),
          },
          unit_amount: Math.floor(cost * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    ui_mode: 'embedded',
    return_url: `${currentHostUrl}/successful-payment/{CHECKOUT_SESSION_ID}`,
  });
  const res_body = JSON.stringify({
    session_id: session.id,
    clientSecret: session.client_secret,
  });
  const res_options = { status: 200 };
  return new Response(res_body, res_options);
}

//This sets the path that you use in your fetch request - see the Checkout for an example
export const config = {
  path: '/api/stripe',
};
