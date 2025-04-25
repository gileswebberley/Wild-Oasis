import toast from 'react-hot-toast';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { differenceInDays, format } from 'date-fns';
import { formatCurrency, getDisplayName } from '../../utils/helpers';
import { bp_sizes } from '../../styles/breakpoints';
import { useUser } from '../authentication/useUser';
import { useCabin } from '../cabins/useCabin';
import { useSettings } from '../settings/useSettings';
import { useAddDetailsToGuest } from './useAddDetailsToGuest';
import { useIndexedDB } from '../../hooks/useIndexedDB';
import { iDB } from '../../utils/shared_constants';

import Spinner from '../../ui/Spinner';
import SlideInY from '../../ui/SlideInY';
import GuestTitleArea from '../../ui/GuestTitleArea';
import CabinSketchHeading from '../../ui/CabinSketchHeading';
import GuestContainer from '../../ui/GuestContainer';
import Range from '../../ui/Range';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import Textarea from '../../ui/Textarea';
import Checkbox from '../../ui/Checkbox';
import SimpleFormRow from '../../ui/SimpleFormRow';
import Input from '../../ui/Input';
import Form from '../../ui/Form';

const Container = styled(GuestContainer)`
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
`;

const CheckboxRow = styled(SimpleFormRow)`
  grid-template-columns: 1fr !important;
  /* override the responsive behaviour */
  @media ${bp_sizes.sm} {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
`;

const NoErrorRow = styled(SimpleFormRow)`
  grid-template-columns: 0.5fr 0.5fr;
  @media ${bp_sizes.sm} {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
`;

function BookingForm() {
  //ok we need a lot of data from various database sources so let's grab all that....
  const { isCheckingUser, user, isAuthenticated, isAnonymous } = useUser();
  const { isLoading: isLoadingCabin, cabin } = useCabin();
  const { isLoading, settings } = useSettings();
  const { isUpdatingGuest: isGuestBusy, updateGuest } = useAddDetailsToGuest();
  const { isDBBusy, data, updateCurrentData, getCurrentData, deleteDatabase } =
    useIndexedDB(iDB.name);

  //Controlled elements for the form, getting to the point where it might be worth using a different solution but this is fine
  const [guests, setGuests] = useState(0);
  const [breakfast, setBreakfast] = useState(false);
  const [natId, setNatId] = useState('');
  const [notes, setNotes] = useState('');

  const navigate = useNavigate();

  //if not authenticated user redirect
  useEffect(() => {
    if (!isAuthenticated && !isAnonymous && !isCheckingUser) {
      toast.error(
        `Please sign up as a guest and select your cabin before visiting this page`
      );
      deleteDatabase(iDB.name).finally(() => navigate('../guest'));
    }
  }, [isAuthenticated, isCheckingUser, navigate, isAnonymous, deleteDatabase]);

  //This is how we get the data from the new indexedDB implementation, this sets 'data' to the data it fetched
  useEffect(() => {
    if (!isDBBusy && !data) {
      console.log(`BookingForm is loading current data`);
      getCurrentData(iDB.store);
    }
  }, [data, getCurrentData, isDBBusy]);

  //Derived api busy constants
  const isUpdatingGuest = isGuestBusy || isDBBusy;
  const isLoadingData = isCheckingUser || isLoading || isLoadingCabin;
  if (isLoadingData) return <Spinner />;

  //No point working these out if we're still loading the data but if we've got here then we have finished loading, although just to avoid single render problems we safely null-coalesce these destructuring statements
  const { fullName, nationalId } = user?.user_metadata ?? {};
  const { startDate, endDate } = data ?? {};
  //convert the date strings from supabase to Date, no need with the new indexedDB
  const start = startDate; //parseISO(startDate);
  const end = endDate; //parseISO(endDate);
  const stayLength = differenceInDays(end, start);

  function handleSubmit(e) {
    e.preventDefault();
    const cabinCost =
      (Number(cabin.regularPrice) - Number(cabin.discount)) * stayLength;
    const brekkieCost = breakfast
      ? Math.ceil(
          Number(settings.breakfastPrice) * stayLength * (+guests + 1) * 100
        ) / 100
      : 0;
    let data = {
      numNights: stayLength,
      numGuests: Number(+guests + 1),
      cabinPrice: cabinCost,
      extrasPrice: brekkieCost,
      totalPrice: cabinCost + brekkieCost,
      status: 'unconfirmed',
      hasBreakfast: breakfast,
      isPaid: false,
      observations: notes,
    };
    if (!nationalId && natId) {
      updateGuest({ nationalId: natId });
    }
    //Create the booking or simply add this final information to the user as we have everything else?
    updateCurrentData(iDB.store, data).then(() => {
      navigate(`../confirm-booking/${cabin.id}`);
    });
  }

  return (
    <SlideInY>
      <GuestTitleArea>
        <CabinSketchHeading as="h1">
          Almost There {getDisplayName(fullName)}...
        </CabinSketchHeading>
      </GuestTitleArea>
      <Container>
        {/* Pop all of this within a div so that we have the bottom row of our container grid free for the button */}
        <CabinSketchHeading as="h3">
          We just need a few more details so we can confirm your booking for our
          cabin &#39;
          {cabin.name}&#39; from
          {' ' + format(start, 'EEEE do MMMM yyyy')} for {stayLength} nights
        </CabinSketchHeading>
        <Form onSubmit={handleSubmit}>
          <NoErrorRow>
            <label htmlFor="guestNumber">
              How many guests will be joining you (maximum of{' '}
              {cabin.maxCapacity - 1})
            </label>
            <Range
              id="guestNumber"
              min={0}
              max={cabin.maxCapacity - 1}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              disabled={isUpdatingGuest}
            />
          </NoErrorRow>
          <CheckboxRow>
            <Checkbox
              checked={breakfast}
              onChange={() => setBreakfast((val) => !val)}
              disabled={isUpdatingGuest}
              id="addBreakfast"
            >
              <details>
                <summary>
                  Add Daily Breakfast for
                  {' ' +
                    formatCurrency(
                      settings.breakfastPrice * stayLength * (+guests + 1)
                    )}
                </summary>
                Would you like to add a delicious breakfast crafted by our chefs
                to your booking for{' '}
                {`${formatCurrency(settings.breakfastPrice * stayLength)} `} per
                person? (you don&#39;t have to make a decision now, you can
                always add it when you arrive)
              </details>
            </Checkbox>
          </CheckboxRow>
          <NoErrorRow>
            <label htmlFor="notes">
              <details>
                <summary>Additional Notes</summary>
                Let us know if you have any special requests or stuff you&#39;d
                like us to know about you and your guests to make your stay as
                relaxing as possible.{' '}
                {breakfast &&
                  'If you have any dietary requirements please mention those here too so your breakfast can be the perfect start to your day.'}
              </details>
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isUpdatingGuest}
              alt="Additional Notes"
            />
          </NoErrorRow>
          {!nationalId && (
            <NoErrorRow>
              <label htmlFor="nId">
                <details>
                  <summary>National ID / Passport Number</summary>
                  Would you mind providing this information to complete this
                  booking please
                </details>
              </label>
              <Input
                id="nId"
                value={natId}
                onChange={(e) => setNatId(e.target.value)}
                disabled={isUpdatingGuest}
                alt="National ID input"
              />
            </NoErrorRow>
          )}
          <FormRow>
            <ButtonGroup>
              <Button
                onPointerDown={() => navigate(-1)}
                disabled={isUpdatingGuest}
              >
                Back
              </Button>
              <Button onPointerDown={handleSubmit} disabled={isUpdatingGuest}>
                Continue
              </Button>
            </ButtonGroup>
          </FormRow>
        </Form>
      </Container>
    </SlideInY>
  );
}

export default BookingForm;
