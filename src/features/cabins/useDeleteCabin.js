import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCabin } from '../../services/apiCabins-v1';
import toast from 'react-hot-toast';

export function useDeleteCabin() {
  //for the onSuccess cache clearing we need access to our queryClient from the App page
  const queryClient = useQueryClient();

  //To allow the delete functionality to work we do not use useQuery but instead useMutation which provides the mutate function, a bit like dispatch from useDispatch
  const { isLoading: isDeleting, mutate: deleteCabinMutate } = useMutation({
    mutationFn: (id) => deleteCabin(id),
    //clear the cache when it's deleted so the ui updates
    onSuccess: () => {
      //you can use the devtools to see the name of the queryKey
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
      //now we can use our react hot toast notification
      toast.success('You have successfully deleted the cabin');
    },
    onError: (err) => toast.error(err.message),
  });
  return { isDeleting, deleteCabinMutate };
}
