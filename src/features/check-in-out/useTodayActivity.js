import { useQuery } from '@tanstack/react-query';
import { getStaysTodayActivity } from '../../services/apiBookings';

export function useTodayActivity() {
  const { isLoading: isGettingToday, data: todaysActivity } = useQuery({
    queryFn: getStaysTodayActivity,
    queryKey: ['todays-activity'],
  });

  return { isGettingToday, todaysActivity };
}
