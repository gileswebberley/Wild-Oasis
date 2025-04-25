import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDetailsToGuestUser } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useAddDetailsToGuest() {
  const queryClient = useQueryClient();
  const { mutate: updateGuest, isLoading: isUpdatingGuest } = useMutation({
    mutationFn: (detailsObj) => addDetailsToGuestUser(detailsObj),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      //navigate('../dashboard');
    },
    onError: (err) => {
      toast.error(`Something went wrong during the guest sign-in
                ERROR: ${err.message}`);
    },
  });

  return { updateGuest, isUpdatingGuest };
}
