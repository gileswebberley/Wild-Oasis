const stripe = require('stripe')(process.env.STRIPE_SECRET);

export default async function handler(req, context) {
  const { cabinName, amount } = context.params;
  console.log(`cabinName from stripe - ${cabinName}`);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'Your stay at our cabin called ' + decodeURI(cabinName),
          },
          unit_amount: Math.floor(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    ui_mode: 'embedded',
    return_url:
      'http://localhost:8888/payment/return?session_id={CHECKOUT_SESSION_ID}',
  });
  const res_body = JSON.stringify({
    session_id: session.id,
    clientSecret: session.client_secret,
  });
  const res_options = { status: 200 };
  return new Response(res_body, res_options);
  //  {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     session_id: session.id,
  //     clientSecret: session.client_secret,
  //   }),
  // };
}

export const config = {
  path: '/api/stripe/:cabinName/:amount',
};
