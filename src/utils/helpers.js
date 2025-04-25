import {
  formatDistance,
  parseISO,
  differenceInDays,
  add,
  addDays,
  eachDayOfInterval,
} from 'date-fns';

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace('about ', '')
    .replace('in', 'In');

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export function fromToday(numDays, withTime = false) {
  const date = add(new Date(), { days: numDays });
  if (!withTime) date.setUTCHours(0, 0, 0, 0);
  return date.toISOString().slice(0, -1);
}

//I created this originally for use in the CabinDatePicker so we can check if today is booked and if so move our start date onto, well, the next clear date (ie the first date after today that isn't booked). It took me quite a while to find that I couldn't use array.includes and to find that toDateString removed the problem of different times on the same date
/**
 *
 * @param {Array<Date>} reservedDatesArray all of the dates that are unavailable (ie already booked)
 * @param {Date} date The date to check against reservedDatesArray (set to today if undefined)
 * @returns {Date} The next un-reserved date after the date passed in
 */
export function getNextClearDate(reservedDatesArray, date = new Date()) {
  const searchDate = date.toDateString();
  function iterateDate() {
    if (
      reservedDatesArray.some((d) => {
        return d.toDateString() === date.toDateString();
      })
    ) {
      //   console.log(`date exists...`);
      date = addDays(date, 1);
      iterateDate();
    }
  }
  iterateDate();
  // console.log(`next clear date after ${searchDate} is: ${date.toDateString()}`);
  return date;
}

export function flattenDateRange(dateRangeObject) {
  return dateRangeObject
    .map((dateRange) =>
      eachDayOfInterval({
        start: dateRange.startDate,
        end: dateRange.endDate,
      })
    )
    .flat();
}

export const dateFormatterLong = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export const formatCurrency = (value) => {
  //going to remove the fractional part if they are .00 as they are not needed
  //apparently value | 0 is an efficient way to achieve the same as Math.floor with bitwise OR, although it might be a little bit dodgy cos it's only meant for integers. so we're saying "if the value rounded down is less than the original value then there must be a fractional part in the value"
  if (Math.floor(value) < value) {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: 'GBP',
    }).format(value);
  } else {
    //remove those redundant decimal part digits...
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value);
  }
};

export function getDisplayName(fullName) {
  return fullName?.split(' ').shift();
}

export const camelToFlat = (c) => {
  c = c.replace(/[A-Z]/g, ' $&');
  c = c[0].toUpperCase() + c.slice(1);
  return c;
};
