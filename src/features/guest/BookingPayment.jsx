import styled from 'styled-components';
import GuestContainer from '../../ui/GuestContainer';
import GuestSubContainer from '../../ui/GuestSubContainer';
import { bp_sizes } from '../../styles/breakpoints';
import { useUser } from '../authentication/useUser';
import { useCabin } from '../cabins/useCabin';
import { useIndexedDB } from '../../hooks/useIndexedDB';
import { iDB } from '../../utils/shared_constants';
import { useCreateBooking } from '../bookings/useCreateBooking';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../authentication/useLogout';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Spinner from '../../ui/Spinner';
import SlideInY from '../../ui/SlideInY';
import GuestTitleArea from '../../ui/GuestTitleArea';
import CabinSketchHeading from '../../ui/CabinSketchHeading';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/helpers';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import Checkout from '../payment/Checkout';

const Container = styled(GuestContainer)`
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
`;

const DetailsSection = styled(GuestSubContainer)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  justify-content: center;
`;

function BookingPayment() {
  const { isCheckingUser, user, isAuthenticated, isAnonymous } = useUser();
  const { isLoading: isLoadingCabin, cabin } = useCabin();
  const { isDBBusy, data, getCurrentData, deleteDatabase } = useIndexedDB(
    iDB.name
  );
  // const { createBookingMutate, isCreatingBooking } = useCreateBooking();

  const navigate = useNavigate();
  // const { logout } = useLogout();

  //if not authenticated user redirect
  useEffect(() => {
    if (!isAuthenticated && !isAnonymous && !isCheckingUser) {
      toast.error(
        `Please sign up as a guest and select your cabin before visiting this page`
      );
      //clear any data that might be in storage from a previous user or the such?
      deleteDatabase(iDB.name).finally(() => navigate('../guest'));
    }
  }, [isAuthenticated, isCheckingUser, navigate, isAnonymous, deleteDatabase]);

  useEffect(() => {
    if (!isDBBusy && !data) {
      getCurrentData(iDB.store);
    }
  }, [data, getCurrentData, isDBBusy]);

  const { totalPrice, bookingId } = data ?? {};

  const { fullName } = user?.user_metadata ?? {};

  if (isCheckingUser || isLoadingCabin || !data) return <Spinner />;

  // function handleSubmit(e) {
  //   e.preventDefault();
  //   toast.success(`DEMO VERSION (Booking added to DB)
  //       In production you would be sent an email and taken to a checkout page...`);
  //   const booking = {
  //     startDate,
  //     endDate,
  //     numNights,
  //     numGuests,
  //     cabinPrice,
  //     extrasPrice,
  //     totalPrice,
  //     status,
  //     hasBreakfast,
  //     isPaid,
  //     observations,
  //     cabinID: cabinId,
  //     guestID,
  //   };

  //   //Just have to think about what to do at this point - perhaps delete the local db, log the user out (because the database booking is created when logging in so causes a lot of problems with the deletion), and navigate to the home page?
  //   // createBookingMutate(booking, {
  //   //   onSuccess: () => {
  //       // logout(false, {
  //       //   onSuccess: () => {
  //       //     deleteDatabase(iDB.name).then(() =>
  //       //       navigate('../', { replace: true })
  //       //     );
  //       //   },
  //       // });
  //     },
  //   });
  // }

  return (
    <SlideInY>
      <GuestTitleArea>
        <CabinSketchHeading as="h1">
          Secure your booking, securely
        </CabinSketchHeading>
      </GuestTitleArea>
      <Container>
        <CabinSketchHeading as="h2">
          Be careful to only use the card number 4242 4242 4242 4242 for testing
        </CabinSketchHeading>
        <DetailsSection>
          <Checkout productName={cabin.name} amount={totalPrice} />
          {/* <ButtonGroup>
            <Button
              onPointerDown={() => navigate(-1)}
              disabled={isCreatingBooking}
            >
              Back
            </Button>
            <Button onPointerDown={handleSubmit} disabled={isCreatingBooking}>
              Confirm Booking
            </Button>
          </ButtonGroup> */}
        </DetailsSection>
      </Container>
    </SlideInY>
  );
}

export default BookingPayment;
