import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { signUp as signUpApi } from '../../services/apiAuth';

export function useSignup() {
  const navigate = useNavigate();
  const { mutate: signUp, isLoading: isSigningUp } = useMutation({
    mutationFn: signUpApi,
    onSuccess: (data) => {
      toast.success(
        `You have successfully added ${data.user?.user_metadata?.fullName} as a new user`
      );
      //navigate('../dashboard');
    },
    onError: (err) => {
      toast.error(`Something went wrong during the sign up proccess
                ERROR: ${err.message}`);
    },
  });

  return { signUp, isSigningUp };
}
