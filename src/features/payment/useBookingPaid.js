import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';

export function useBookingPaid() {
  const queryClient = useQueryClient();

  const { isLoading: isPaying, mutate: paymentUpdate } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        isPaid: true,
      }),

    onSuccess: (data) => {
      toast.success(`Booking payment status successfully updated`);
      queryClient.invalidateQueries({ active: true });
    },

    onError: (error) => {
      toast.error(`Something went wrong whilst trying to update the payment status of this booking
        ERROR: ${error.message}`);
    },
  });

  return { isPaying, paymentUpdate };
}
