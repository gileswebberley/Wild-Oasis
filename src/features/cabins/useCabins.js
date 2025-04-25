import { useQuery } from '@tanstack/react-query';
import { getCabins } from '../../services/apiCabins-v1';

export function useCabins() {
  //pass in the unique query key as an array which identifies this data, and the query function which does the actual fetching but must return a promise (as in any async function). This returns a lot of isFunctions along with the status
  const {
    isLoading,
    data: { data: cabins, count } = {},
    error,
  } = useQuery({
    queryKey: ['cabins'],
    queryFn: getCabins,
    networkMode: 'offlineFirst',
  });

  return { isLoading, error, cabins, count };
}
