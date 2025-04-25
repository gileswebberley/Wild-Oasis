import { useQuery } from '@tanstack/react-query';
import { getCabinById } from '../../services/apiCabins-v1';
import { useParams } from 'react-router-dom';

//This requires the cabinId to be set in the params of the url
export function useCabin() {
  const { cabinId: id } = useParams();
  const {
    isLoading,
    data: cabin,
    error,
  } = useQuery({
    queryKey: ['cabin', id],
    queryFn: () => getCabinById(id),
    // networkMode: 'offlineFirst',
  });

  return { isLoading, error, cabin: cabin?.data };
}
