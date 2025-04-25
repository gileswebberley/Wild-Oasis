export const PAGE_SIZE = 5;
//Added this as a way to take care of filtered results going out of bounds, now the Filter takes this into account
// NAME is the param name that we use to keep track of the page number
//IS_LINEAR is whether the pagination system is simply a 'previous:next' button system (true) or a numbered page system (false). If set to true then the pre-fetching of the previous page will not be implemented as that data should already be cached
export const IS_PAGINATED = {
  NAME: 'page',
  IS_LINEAR: true,
  bookings: true,
  cabins: true,
};
//freezing so that it can only be set here, in one place, to avoid losing track of it. It's meant to be a simple configuration type system after all.
Object.freeze(IS_PAGINATED);

//try to get the indexedDB working across pages
export const iDB = {
  name: 'CabinBookingDB',
  store: 'booking',
  key: 'guestId',
};
