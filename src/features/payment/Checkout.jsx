import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { useCallback } from 'react';

const stripePromise = loadStripe(
  'pk_test_51RIruECRNgWRRJ4LR7JqZMXKf4YtFcieHSO3BQKCnDQ9mu6EokvKd0MKO2hZ7KQg4lH9w1dIVRsbiOG78DCc8DGn007n5NmPTj'
);

function Checkout() {
  const fetchClientSecret = useCallback(() => {
    return fetch('/');
  });
  return <div></div>;
}

export default Checkout;
