import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout as logoutApi } from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';

export function useLogout(redirect = true) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isLoading: isLoggingOut } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      //clear out the user from any react query cache
      queryClient.setQueryData(['user'], null);
      queryClient.removeQueries(['user']);
      //now we've started making the public site let's go there on logout
      if (redirect) navigate('../', { replace: true });
    },
  });
  return { logout, isLoggingOut };
}
