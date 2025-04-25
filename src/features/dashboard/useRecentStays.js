import { useQuery } from '@tanstack/react-query';
import { subDays } from 'date-fns';
import { useSearchParams } from 'react-router-dom';
import { getStaysAfterDate } from '../../services/apiBookings';

export function useRecentStays() {
  const [searchParams] = useSearchParams();
  const numDays = Number(searchParams.get('last'));

  const queryDate = subDays(new Date(), numDays).toISOString();

  const { isLoading: isLoadingRecentStays, data: recentStays } = useQuery({
    queryFn: () => getStaysAfterDate(queryDate),
    queryKey: ['stays', numDays],
  });

  const confirmedStays = recentStays?.filter(
    (stay) => stay.status !== 'unconfirmed'
  );

  return { isLoadingRecentStays, recentStays, confirmedStays };
}
