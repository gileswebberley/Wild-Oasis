import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSetting as updateSettingApi } from '../../services/apiSettings';
import toast from 'react-hot-toast';
import { camelToFlat } from '../../utils/helpers';

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  const { mutate: updateSetting, isLoading: isUpdatingSetting } = useMutation({
    mutationFn: updateSettingApi,
    onSuccess: (data) => {
      toast.success(
        `${camelToFlat(
          Object.keys(data.newSetting)[0]
        )} successfully changed to ${Object.values(data.newSetting)[0]}`
      );
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (err) =>
      toast.error(`Something went wrong whilst updating settings`),
  });

  return { updateSetting, isUpdatingSetting };
}
