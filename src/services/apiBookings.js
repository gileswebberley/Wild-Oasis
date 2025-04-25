import { getToday } from '../utils/helpers';
import { PAGE_SIZE } from '../utils/shared_constants';
import supabase from './supabase';

export async function getBookingDatesByCabinId({ cabinId }) {
  // console.log(`eq by...${cabinId}`);
  const { data, error } = await supabase
    .from('bookings')
    .select('startDate,endDate')
    .eq('cabinID', cabinId);
  if (error) {
    throw new Error(`Cabin dates failed: ${error.message}`);
  }
  // console.log(data);
  return data;
}

export async function getBookings({ filter, sortBy, page }) {
  //this select statement is getting the whole booking row and also the information from the linked (foreign keys) tables of guests and cabins - ie for each row it will collect the data from the cabin and guest referenced in that booking. When working with pagination we can also send a second argument to the select method which makes the query return the count as well as the data.
  let query = supabase
    .from('bookings')
    .select('*,cabins(name), guests(fullName, email)', { count: 'exact' });

  //FILTER
  if (filter) query = query.eq(filter.field, filter.value);
  //SORT
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === 'asc',
    });
  //PAGINATION
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = page * PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error('Bookings could not be loaded');
  }

  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, cabins(*), guests(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking not found');
    // return error;
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
//date: ISOString
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from('bookings')
    .select('created_at, totalPrice, extrasPrice')
    .gte('created_at', date)
    .lte('created_at', getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from('bookings')
    // .select('*')
    .select('*, guests(fullName)')
    .gte('startDate', date)
    .lte('startDate', getToday());

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, guests(fullName, nationality, countryFlag)')
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order('created_at');

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from('bookings')
    .update(obj)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)
    .select('*, guests(fullName)')
    .single();

  if (error) {
    console.error(error);
    throw new Error(`Booking ${id} could not be deleted`);
  }
  return data;
}

export async function createBooking(booking) {
  const { error } = await supabase.from('bookings').insert(booking);
  //I'm not sure why adding select() to this call produces an error considering it is advised in the api guide? Having tried a few different techniques to no avail I will have to leave it for now and simply return true I think :(

  if (error) {
    console.error(error);
    throw new Error(`Booking could not be added`);
  }
  return true;
}
