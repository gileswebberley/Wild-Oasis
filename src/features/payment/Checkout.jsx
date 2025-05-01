import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { useCallback } from 'react';

const stripePromise = loadStripe(
  'pk_test_51RIruECRNgWRRJ4LR7JqZMXKf4YtFcieHSO3BQKCnDQ9mu6EokvKd0MKO2hZ7KQg4lH9w1dIVRsbiOG78DCc8DGn007n5NmPTj'
);

function Checkout({ productName, amount }) {
  const fetchClientSecret = useCallback(() => {
    return fetch(`../api/stripe/`, {
      method: 'POST',
      body: JSON.stringify({ product: productName, cost: amount }),
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, [amount, productName]);

  const options = { fetchClientSecret };

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}

export default Checkout;
