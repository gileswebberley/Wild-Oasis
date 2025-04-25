import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function useCheckOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading: isCheckingOut, mutate: checkOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: 'checked-out',
      }),

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out`);
      queryClient.invalidateQueries({ active: true });
      //navigate(-1);
    },

    onError: (error) => {
      toast.error(`Something went wrong whilst trying to check out this booking
        ERROR: ${error.message}`);
    },
  });

  return { isCheckingOut, checkOut };
}
