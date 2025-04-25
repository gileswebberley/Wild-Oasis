import { useQuery } from '@tanstack/react-query';
import { getBookingDatesByCabinId } from '../../services/apiBookings';

export function useBookingDates(cabinId) {
  //   console.log(`use...${cabinId}`);
  const {
    isLoading,
    data: bookingDates,
    error,
  } = useQuery({
    queryKey: ['booking-dates', cabinId],
    queryFn: () => getBookingDatesByCabinId({ cabinId }),
  });

  return { isLoading, error, bookingDates };
}
