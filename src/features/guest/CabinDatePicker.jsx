import { areIntervalsOverlapping, differenceInCalendarDays } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { flattenDateRange, getNextClearDate } from '../../utils/helpers';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSettings } from '../settings/useSettings';
import SpinnerMini from '../../ui/SpinnerMini';
import toast from 'react-hot-toast';
import Button from '../../ui/Button';
import styled from 'styled-components';
import Heading from '../../ui/Heading';
import { useNavigate } from 'react-router-dom';
import SpinnerTiny from '../../ui/SpinnerTiny';
import { useIndexedDB } from '../../hooks/useIndexedDB';
import { iDB } from '../../utils/shared_constants';

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DateRangeHeading = styled(Heading)`
  text-align: center;
  color: var(--color-green-700);
`;

function CabinDatePicker({ reservedDates, cabinId }) {
  const navigate = useNavigate();
  const [availDate, setAvailDate] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  //get the settings cos we've got a maximum booking length to implement
  const { isLoading, error, settings } = useSettings();
  //I'm moving away from thinking that a context is a good way to take care of this now and instead I am going to add it to the guest user in the db
  // const { setStay } = useGuestApiContext();
  // const { isUpdatingGuest, updateGuest } = useAddDetailsToGuest();
  const { updateCurrentData, isDBBusy: isUpdatingGuest } = useIndexedDB(
    iDB.name
  );

  //we want to block out all the days that are already booked so they cannot be selected - I'm creating a flat array of all the dates so I can use an includes statement
  const allBookedDates = useMemo(
    () => flattenDateRange(reservedDates),
    [reservedDates]
  );

  const dpFormatDateRanges = useMemo(
    () =>
      reservedDates.map((dateRange) => {
        return { start: dateRange.startDate, end: dateRange.endDate };
      }),
    [reservedDates]
  );

  //decided to make the default selected day into the first unbooked day after today because otherwise it was just randomly selecting today by default I think
  useEffect(() => {
    const clearDate = getNextClearDate(allBookedDates);
    setAvailDate(clearDate);
  }, [allBookedDates]);

  if (isLoading) return <SpinnerMini />;
  if (error)
    toast.error(
      `We had a problem getting some information required, please contact us to let us know`
    );

  //lots of fiddling to get datepicker working for us
  function handleDateSelect(dates) {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  }

  function addDatesToBooking() {
    //check that the stay isn't too long (notice it takes the end date first)
    const stayLength = differenceInCalendarDays(endDate, startDate);
    // console.log(stayLength);
    if (
      stayLength > settings.maxBookingLength ||
      stayLength < settings.minBookingLength
    ) {
      toast.error(
        `Unfortunately we require your stay to be between ${settings.minBookingLength} and ${settings.maxBookingLength} days in duration and you have selected ${stayLength} overnight`
      );
      return;
    }
    //check that our range hasn't been selected across already booked dates
    let isClear = true;
    //I want to break out of the loop if I find an overlap so used for-of rather than forEach
    for (const reservedRange of reservedDates) {
      if (
        areIntervalsOverlapping(
          { start: reservedRange.startDate, end: reservedRange.endDate },
          { start: startDate, end: endDate },
          { inclusive: true }
        )
      ) {
        isClear = false;
        break;
      }
    }
    // console.log(`isClear: ${isClear}`);
    if (!isClear) {
      toast.error(
        'You seem to have unavailable dates in your selected date range, please avoid the dates marked in red '
      );
      setEndDate(null);
      return;
    }
    // setStay(startDate, endDate, cabinId);
    // updateGuest({ startDate, endDate, cabinId });
    updateCurrentData(iDB.store, { startDate, endDate, cabinId }).then(
      navigate(`../booking-details/${cabinId}`)
    );
  }

  function clearDates() {
    setStartDate(null);
    setEndDate(null);
    // setAvailDate(null);
  }

  return (
    <DateContainer>
      <DatePicker
        selected={availDate}
        minDate={availDate}
        onChange={handleDateSelect}
        excludeDateIntervals={dpFormatDateRanges}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        swapRange
        dateFormat="do MMMM yyyy"
        inline
      />
      {(startDate || endDate) && (
        <>
          {/* <ButtonGroup> removed so the buttons create full width rows as it looks nice */}
          <Button
            size="small"
            variation="secondary"
            disabled={isUpdatingGuest}
            onClick={() => {
              clearDates();
            }}
          >
            Clear Selected Dates
          </Button>
          {startDate && endDate && (
            <Button
              size="small"
              variation="primary"
              disabled={isUpdatingGuest}
              onClick={addDatesToBooking}
            >
              Select Stay
            </Button>
          )}
          {/* </ButtonGroup> */}
          <DateRangeHeading as="h4">
            {isUpdatingGuest ? (
              <SpinnerTiny />
            ) : (
              `${startDate.toDateString()} - ${endDate?.toDateString() ?? ''}`
            )}
          </DateRangeHeading>
        </>
      )}
    </DateContainer>
  );
}

export default CabinDatePicker;
