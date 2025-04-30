import styled from 'styled-components';
import GuestContainer from '../../ui/GuestContainer';
import GuestSubContainer from '../../ui/GuestSubContainer';
import { useUser } from '../authentication/useUser';
import { useCabin } from '../cabins/useCabin';
import { useIndexedDB } from '../../hooks/useIndexedDB';
import { iDB } from '../../utils/shared_constants';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Spinner from '../../ui/Spinner';
import SlideInY from '../../ui/SlideInY';
import GuestTitleArea from '../../ui/GuestTitleArea';
import CabinSketchHeading from '../../ui/CabinSketchHeading';
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

  // const { fullName } = user?.user_metadata ?? {};

  if (isCheckingUser || isLoadingCabin || !data) return <Spinner />;

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
          <ButtonGroup>
            <Button
              onPointerDown={() => navigate(`../confirm-booking/${cabin.id}`)}
            >
              Back
            </Button>
            {/*  <Button onPointerDown={handleSubmit} disabled={isCreatingBooking}>
              Confirm Booking
            </Button>*/}
          </ButtonGroup>
        </DetailsSection>
      </Container>
    </SlideInY>
  );
}

export default BookingPayment;
