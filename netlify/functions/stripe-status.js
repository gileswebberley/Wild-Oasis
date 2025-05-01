import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET);

export default async function status(req, res) {
  // Get the URL from the request - Netlify AI assistant suggestion
  const url = new URL(req.url);
  // Access the session_id query parameter
  const sessionId = url.searchParams.get('session_id');
  //   console.log(`Stripe status called with req.query: ${sessionId}`);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

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
