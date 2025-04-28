const stripe = require('stripe')(process.env.STRIPE_SECRET);

export default async function handler(req, context) {
  const { cabinName, amount } = context.params;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'cabin ' + cabinName,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    ui_mode: 'embedded',
    return_url:
      'http://localhost:8888/payment/return?session_id={CHECKOUT_SESSION_ID}',
  });
  return {
    statusCode: 200,
    body: JSON.stringify({
      session_id: session.id,
      clientSecret: session.client_secret,
    }),
  };
}

export const config = {
  path: '/stripe/:cabinName/:amount',
};
