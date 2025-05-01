import { useNavigate, useSearchParams } from 'react-router-dom';
import { useIndexedDB } from '../hooks/useIndexedDB';
import Button from '../ui/Button';
import ButtonGroup from '../ui/ButtonGroup';
import CabinSketchHeading from '../ui/CabinSketchHeading';
import GuestContainer from '../ui/GuestContainer';
import SlideInY from '../ui/SlideInY';
import { useLogout } from '../features/authentication/useLogout';
import { iDB } from '../utils/shared_constants';
import { HiClipboardCopy } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useUser } from '../features/authentication/useUser';
import { useEffect, useRef, useState } from 'react';
import { useBookingPaid } from '../features/payment/useBookingPaid';
import Spinner from '../ui/Spinner';
import { format } from 'date-fns';

const noHarvestEmail = 'gileswebberley@gmail.com';
const noHarvestSubject = encodeURI('Message from the Wild Oasis Demo site');

function Success() {
  //We will be trying to use the stripe-status serverless-function to check the payment status
  const [payStatus, setPayStatus] = useState(null);
  const [searchParams] = useSearchParams();
  //Get the user's name and check that they're actually authorised to be here
  const { isCheckingUser, user, isAuthenticated, isAnonymous } = useUser();
  //Get the iDB so we can use the bookingId to change the isPaid status and delete it from the user's system
  const { isDBBusy, data, getCurrentData, deleteDatabase } = useIndexedDB(
    iDB.name
  );
  //Here's our api hook that set's isPaid to true
  const { isPaying, paymentUpdate } = useBookingPaid();

  const navigate = useNavigate();
  //If we delete the iDB then we need to log the user out as well otherwise the GuestForm will cause errors
  const { logout } = useLogout();

  //if not authenticated user redirect
  useEffect(() => {
    if (!isAuthenticated && !isAnonymous && !isCheckingUser) {
      toast.error(
        `You shouldn't be on this page, it's for authenticated users when their fake payment has been successful`
      );
      navigate('../');
    }
  }, [isAuthenticated, isCheckingUser, navigate, isAnonymous]);

  //get the iDB data so we can get the bookingId
  useEffect(() => {
    if (!isDBBusy && !data) {
      getCurrentData(iDB.store);
    }
  }, [data, getCurrentData, isDBBusy]);

  const { fullName } = user?.user_metadata ?? {};
  const { bookingId, startDate, cabinId } = data ?? {};
  //This is a flag for the setting of isPaid (using a ref cos it doesn't need to trigger a re-render I don't think)
  const paymentStatusUpdated = useRef(false);
  //When we have the bookingId for the first time we set the isPaid status
  useEffect(() => {
    if (
      bookingId &&
      !paymentStatusUpdated.current &&
      payStatus === 'complete'
    ) {
      paymentStatusUpdated.current = true;
      paymentUpdate(bookingId, {
        onSuccess: () =>
          toast.success('Your booking has been set as PAID on our system'),
        onError: (err) => {
          paymentStatusUpdated.current = false;
          toast.error(
            `Something went wrong when we tried to set your booking to PAID`
          );
        },
      });
    }
  }, [bookingId, payStatus, paymentUpdate]);

  //Finally we'll call the server with our session_id that should be in the url (from the return_url of our stripe function)
  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    fetch(`../api/stripe-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setPayStatus(data.status);
      });
  }, [searchParams]);

  //and our handlers...
  function handleFinish(e) {
    e.preventDefault();
    logout(false, {
      onSuccess: () => {
        deleteDatabase(iDB.name).then(() => navigate('../', { replace: true }));
      },
    });
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(noHarvestEmail);
    toast.success(
      'Thanks for copying my email to your clipboard, I look forward to hearing from you'
    );
  }

  if (isCheckingUser || isPaying || !data || !payStatus) return <Spinner />;

  //This is the code for a failed payment
  if (payStatus === 'open') {
    toast.error(
      `Something went wrong during payment, you will be redirected back to the checkout`
    );
    navigate(`../booking-payment/${cabinId}`);
  }

  return (
    <SlideInY>
      <GuestContainer>
        <CabinSketchHeading as="h1">
          Thank you {fullName} for your booking, we'll see you here on{' '}
          {' ' + format(startDate, 'EEEE do MMMM yyyy')}!
        </CabinSketchHeading>
        <CabinSketchHeading as="h4">
          That's it for now, I am learning still and so will update this page
          and the process further over the coming days/weeks. If you'd like to
          delete the booking data that we've stored on your system and log out
          then please click the link below. <br />I would really love to get
          some real world experience, as I haven't been involved in web
          development since the early noughties, so if you can help me out
          please do pop me an email at{' '}
          <a
            href={`mailto:${noHarvestEmail}?subject=${noHarvestSubject}`}
            target="_blank"
            rel="noreferrer"
          >
            {noHarvestEmail}
          </a>
          <span title="Click to copy my email address to your clipboard">
            <HiClipboardCopy onPointerDown={copyToClipboard} /> I would really
          </span>
          appreciate it.
          <br />
          T'ta for now.
        </CabinSketchHeading>
        <ButtonGroup>
          <Button onClick={handleFinish}>Tidy Up</Button>
        </ButtonGroup>
      </GuestContainer>
    </SlideInY>
  );
}

export default Success;
