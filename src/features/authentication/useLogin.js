import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginApi } from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useLogin() {
  const navigate = useNavigate();
  //we're using this to set our user into the cache immediately so that useUser (with it's networkMode set to 'offlineFirst') shouldn't have to make another api request
  const queryClient = useQueryClient();

  const { mutate: login, isLoading: isLoggingIn } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (userData) => {
      queryClient.setQueryData(['user'], userData.user);
      navigate('../dashboard', { replace: true });
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(`Error during login: Incorrect email or password`);
    },
  });
  return { login, isLoggingIn };
}
