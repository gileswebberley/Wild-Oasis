import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBookings } from '../../services/apiBookings';
import { useSearchParams } from 'react-router-dom';
import { IS_PAGINATED, PAGE_SIZE } from '../../utils/shared_constants';
//implementing our api-side filtering and sorting unlike the client side approach used in the CabinsTable
export function useBookings(filterField = 'status') {
  const [searchParams] = useSearchParams();
  //here for the pre-fetching
  const queryClient = useQueryClient();

  //PAGINATION - added a safety system to pagination as filtering was dangerous, there is now an object in shared_constants where you can switch it on/off for given pages
  let page = IS_PAGINATED.bookings ? 1 : null;
  const paramPage = searchParams.get(IS_PAGINATED.NAME);
  if (paramPage) page = Number(paramPage);

  //FILTERING
  const filterValue = searchParams.get(filterField);
  let filter =
    !filterValue || filterValue === 'all'
      ? null
      : { field: filterField, value: filterValue };

  //if we were wanting to have, for example, the filterField set to price and only return those bookings that were more expensive than a filterValue of 5000 we could also pass in a 'method' as part of the object (using the name of the supabase query function which at the moment is simply eq(field, value)) and set it to gte(filterField,filterValue). Then in the apiBookings.getBookings we would set the query by having - query = query[method ? filter.method : 'eq'](filter.field, filter.value);

  //SORTING
  const sortByRaw = searchParams.get('sortBy') || null;
  let sortBy = null;
  if (sortByRaw) {
    const [sortField, sortDir] = sortByRaw.split('-');
    sortBy = { field: sortField, direction: sortDir };
  }

  //we are now returning the count as well as the data from getBookings so we destructure that in here (add an empty object so it doesn't try when data is undefined)
  const {
    isLoading,
    data: { data: bookings, count } = {},
    error,
  } = useQuery({
    queryKey: ['bookings', filter, sortByRaw, page], //this will now execute the associated queryFn whenever the filter variable's value changes (in this case when another filter button is pressed
    queryFn: () => getBookings({ filter, sortBy, page }), //remember that the queryfn can only have one argument so we have to put them both in an object
    networkMode: 'offlineFirst', //this is to try to force an error to be thrown if user is offline
  });

  //Pre-fetching using react query prefetchQuery (there is also an "infinite query for infinite scroll" functionality available so I'll look into that if I find a need in the future)
  if (IS_PAGINATED.bookings) {
    const pageCount = Math.ceil(count / PAGE_SIZE);
    //Decided there's no point in getting the previous page if we just have a prev:next button set up as the previous page will already be cached
    if (page > 1 && !IS_PAGINATED.IS_LINEAR) {
      //pre-fetch the previous page
      queryClient.prefetchQuery({
        queryKey: ['bookings', filter, sortByRaw, page - 1],
        queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
      });
    }
    if (page < pageCount) {
      //pre-fetch the next page
      queryClient.prefetchQuery({
        queryKey: ['bookings', filter, sortByRaw, page + 1],
        queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
      });
    }
  }

  return { isLoading, bookings, count, error };
}
