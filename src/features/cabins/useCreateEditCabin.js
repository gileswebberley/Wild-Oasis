import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEditCabin } from '../../services/apiCabins-v1';
import toast from 'react-hot-toast';

/**
 *
 * @param {Boolean} isEditMode optional - denotes whether we are creating a cabin or editing a cabin that already exists. If not stated then the success message will simply default to saying 'created' rather than 'updated' when editing.
 * @returns
 */
export function useCreateEditCabin(isEditMode = false) {
  const queryClient = useQueryClient();
  const { mutate: createEditMutate, isLoading: isBusy } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: (data) => {
      toast.success(
        `Cabin "${data.name}" successfully ${
          isEditMode ? 'updated' : 'created'
        }`
      );
      //to reload cabins data
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
    },
    onError: (error) => {
      toast.error(`Something went wrong whilst trying to add this new cabin -
        ${error.message}`);
    },
  });
  return { createEditMutate, isBusy };
}
