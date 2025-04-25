import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signInGuest as signInGuestApi } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useGuestSignIn() {
  const queryClient = useQueryClient();
  const { mutate: signInGuest, isLoading: isSigningInGuest } = useMutation({
    mutationFn: ({ fullName, email, avatar, country, nationalId }) =>
      signInGuestApi({
        fullName,
        email,
        avatar,
        country,
        nationalId,
      }),
    onSuccess: (data) => {
      toast.success(
        `Welcome ${data.user?.user_metadata?.fullName} (${data.user?.user_metadata?.guestId}) as our guest`
      );
      queryClient.setQueryData(['user'], data.user);
      //navigate('../dashboard');
    },
    onError: (err) => {
      toast.error(`Something went wrong during the guest sign-in
                ERROR: ${err.message}`);
    },
  });

  return { signInGuest, isSigningInGuest };
}
