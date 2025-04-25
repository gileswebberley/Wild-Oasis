import styled from 'styled-components';
import BookingDataBox from '../../features/bookings/BookingDataBox';

import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from '../bookings/useBooking';
import Spinner from '../../ui/Spinner';
import { useEffect, useState } from 'react';
import Checkbox from '../../ui/Checkbox';
import { formatCurrency } from '../../utils/helpers';
import { useCheckIn } from './useCheckIn';
import { useSettings } from '../settings/useSettings';
import SimpleFormRow from '../../ui/SimpleFormRow';

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  //the user must confirm that payment has been received before checking in
  const [isPaid, setIsPaid] = useState(false);
  //to add breakfast to a booking when checking in
  const [lastMinuteBreakfast, setLastMinuteBreakfast] = useState(false);
  const { isLoading: isLoadingSettings, settings } = useSettings();
  const { isLoading, booking } = useBooking();
  const { isCheckingIn, checkIn, isAddingBreakfast, addBreakfastWithCheckIn } =
    useCheckIn();

  useEffect(() => {
    setIsPaid(booking?.isPaid ?? false);
  }, [booking]);

  const moveBack = useMoveBack();

  if (isLoading || isCheckingIn || isLoadingSettings || isAddingBreakfast)
    return <Spinner />;
  // console.log(isPaid);

  const {
    id: bookingId,
    isPaid: bookingPaid,
    guests,
    totalPrice,
    cabinPrice,
    extrasPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;

  const breakfastPrice =
    Math.ceil(settings.breakfastPrice * numGuests * numNights * 100) / 100;

  let priceToPay = bookingPaid ? 0 : totalPrice;
  if (bookingPaid) {
    priceToPay = lastMinuteBreakfast ? breakfastPrice : 0;
  } else {
    priceToPay = lastMinuteBreakfast ? breakfastPrice + cabinPrice : totalPrice;
  }

  function handleToggleBreakfast() {
    if (!lastMinuteBreakfast) {
      setLastMinuteBreakfast(true);
      setIsPaid(false);
    } else {
      setLastMinuteBreakfast(false);
    }
  }

  function handleCheckin() {
    if (isPaid) {
      if (lastMinuteBreakfast) {
        addBreakfastWithCheckIn({
          bookingId,
          breakfastPrice,
          newTotal: cabinPrice + breakfastPrice,
        });
      } else {
        checkIn(bookingId);
      }
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={lastMinuteBreakfast}
            onChange={handleToggleBreakfast}
            // disabled={isAddingBreakfast}
            id="addBreakfast"
          >
            Add breakfast to booking for{' '}
            {`${formatCurrency(
              settings.breakfastPrice
            )} pp/pd (${formatCurrency(breakfastPrice)})`}
          </Checkbox>
        </Box>
      )}

      {(!bookingPaid || lastMinuteBreakfast) && (
        <Box>
          <Checkbox
            checked={isPaid}
            onChange={() => setIsPaid((confirm) => !confirm)}
            disabled={bookingPaid && !lastMinuteBreakfast}
            id="confirm-paid"
          >
            I confirm that {guests.fullName} has paid the{' '}
            {formatCurrency(priceToPay)} that is owed
          </Checkbox>
        </Box>
      )}
      <SimpleFormRow>
        <ButtonGroup>
          {isPaid && (
            <Button disabled={!isPaid} onClick={handleCheckin}>
              Complete check-in
            </Button>
          )}
          <Button variation="secondary" onClick={moveBack}>
            Back
          </Button>
        </ButtonGroup>
      </SimpleFormRow>
    </>
  );
}

export default CheckinBooking;
