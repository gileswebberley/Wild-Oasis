import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET);

export default async function status(req, res) {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  const res_body = JSON.stringify({
    status: session.status,
    customer_email: session.customer_details.email,
  });
  const res_options = { status: 200 };

  return new Response(res_body, res_options);
}

export const config = {
  path: '/api/stripe-status',
};
