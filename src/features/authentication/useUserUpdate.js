import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateCurrentUser,
  updateUserPassword as updateUserPasswordApi,
} from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useUserUpdate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading: isUpdatingUser } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (data) => {
      toast.success(
        `${data?.user?.user_metadata?.fullName} successfully updated`
      );
      //we need this to get the header user info to update
      queryClient.setQueryData(['user'], data.user);
    },
    onError: (error) => {
      toast.error(`There was an error whilst trying to update the user
            ERROR: ${error.message}`);
    },
  });
  const { mutate: updateUserPassword, isLoading: isUpdatingUserPassword } =
    useMutation({
      mutationFn: updateUserPasswordApi,
      onSuccess: (data) => {
        toast.success(
          `${data?.user?.user_metadata?.fullName} password successfully updated`
        );
      },
      onError: (error) => {
        toast.error(`There was an error whilst trying to update the user password
            ERROR: ${error.message}`);
      },
    });
  return {
    updateUser,
    isUpdatingUser,
    updateUserPassword,
    isUpdatingUserPassword,
  };
}
