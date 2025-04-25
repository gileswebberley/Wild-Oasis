// import { useEffect } from 'react';
// import { useUser } from '../features/authentication/useUser';
// import { useIndexedDB } from '../hooks/useIndexedDB';
// import { iDB } from '../utils/shared_constants';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import Spinner from '../ui/Spinner';
// import SlideInY from '../ui/SlideInY';
// import CabinSketchHeading from '../ui/CabinSketchHeading';
// import { useCabin } from '../features/cabins/useCabin';
// import styled from 'styled-components';
// import GuestContainer from '../ui/GuestContainer';
// import GuestSubContainer from '../ui/GuestSubContainer';
// import { bp_sizes } from '../styles/breakpoints';
// import { format } from 'date-fns';
// import ButtonGroup from '../ui/ButtonGroup';
// import Button from '../ui/Button';
// import { formatCurrency } from '../utils/helpers';
// import { useCreateBooking } from '../features/bookings/useCreateBooking';
// import { useLogout } from '../features/authentication/useLogout';
// import GuestTitleArea from '../ui/GuestTitleArea';

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

const DetailsRow = styled.section`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding: 1rem;
  border-top: 1px solid var(--color-grey-400);

  &:first-child {
    border-top: none;
  }
  /* because we have a last row with the button group we use this to select the last DetailsRow */
  &:nth-last-child(-n + 2) {
    border-bottom: 1px solid var(--color-grey-400);
  }

  &:nth-last-child(-n + 1) {
    padding-top: 3rem;
  }

  @media (${bp_sizes.sm}) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const DetailsLabel = styled.span`
  font-weight: 600;
  min-width: fit-content;
`;

function BookingConfirmation() {
  const { isCheckingUser, user, isAuthenticated, isAnonymous } = useUser();
  const { isLoading: isLoadingCabin, cabin } = useCabin();
  const { isDBBusy, data, getCurrentData, deleteDatabase } = useIndexedDB(
    iDB.name
  );
  const { createBookingMutate, isCreatingBooking } = useCreateBooking();

  const navigate = useNavigate();
  const { logout } = useLogout();

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

  const {
    startDate,
    endDate,
    cabinId,
    guestID,
    numNights,
    numGuests,
    cabinPrice,
    extrasPrice,
    totalPrice,
    status,
    hasBreakfast,
    isPaid,
    observations,
  } = data ?? {};

  const { fullName } = user?.user_metadata ?? {};

  if (isCheckingUser || isLoadingCabin || !data) return <Spinner />;

  function handleSubmit(e) {
    e.preventDefault();
    toast.success(`DEMO VERSION (Booking added to DB)
        In production you would be sent an email and taken to a checkout page...`);
    const booking = {
      startDate,
      endDate,
      numNights,
      numGuests,
      cabinPrice,
      extrasPrice,
      totalPrice,
      status,
      hasBreakfast,
      isPaid,
      observations,
      cabinID: cabinId,
      guestID,
    };

    //Just have to think about what to do at this point - perhaps delete the local db, log the user out (because the database booking is created when logging in so causes a lot of problems with the deletion), and navigate to the home page?
    createBookingMutate(booking, {
      onSuccess: () => {
        logout(false, {
          onSuccess: () => {
            deleteDatabase(iDB.name).then(() =>
              navigate('../', { replace: true })
            );
          },
        });
      },
    });
  }

  return (
    <SlideInY>
      <GuestTitleArea>
        <CabinSketchHeading as="h1">
          Let&#39;s get you booked in
        </CabinSketchHeading>
      </GuestTitleArea>
      <Container>
        <CabinSketchHeading as="h2">
          Please check that all of the details of your stay are correct before
          confirming
        </CabinSketchHeading>
        <DetailsSection>
          <DetailsRow>
            <DetailsLabel>Your name: </DetailsLabel>
            {fullName}
          </DetailsRow>
          <DetailsRow>
            <DetailsLabel>Cabin name: </DetailsLabel>
            {cabin.name}
          </DetailsRow>
          <DetailsRow>
            <DetailsLabel>Number of guests: </DetailsLabel>
            {numGuests}
          </DetailsRow>
          <DetailsRow>
            <DetailsLabel>Dates of booking: </DetailsLabel>
            {format(startDate, 'EEEE do MMMM yyyy') + ' '}to
            {' ' + format(endDate, 'EEEE do MMMM yyyy')}
          </DetailsRow>
          <DetailsRow>
            <DetailsLabel>Number of nights: </DetailsLabel>
            {numNights}
          </DetailsRow>
          {observations && (
            <DetailsRow>
              <DetailsLabel>Additional notes: </DetailsLabel>
              {observations}
            </DetailsRow>
          )}
          <DetailsRow>
            <DetailsLabel>Cabin price: </DetailsLabel>
            {formatCurrency(cabinPrice)}
          </DetailsRow>
          <DetailsRow>
            <DetailsLabel>Cost of breakfasts: </DetailsLabel>
            {hasBreakfast ? formatCurrency(extrasPrice) : 'n/a'}
          </DetailsRow>
          <DetailsRow>
            <DetailsLabel>Total to pay: </DetailsLabel>
            {formatCurrency(totalPrice)}
          </DetailsRow>
          <ButtonGroup>
            <Button
              onPointerDown={() => navigate(-1)}
              disabled={isCreatingBooking}
            >
              Back
            </Button>
            <Button onPointerDown={handleSubmit} disabled={isCreatingBooking}>
              Confirm Booking
            </Button>
          </ButtonGroup>
        </DetailsSection>
      </Container>
    </SlideInY>
  );
}

export default BookingConfirmation;
