import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteBooking } from '../../services/apiBookings';

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { mutate: deleteBookingMutate, isLoading: isDeletingBooking } =
    useMutation({
      mutationFn: (bookingId) => deleteBooking(bookingId),
      onSuccess: (data) => {
        // console.table(data);
        toast.success(
          `Booking for ${
            data.guests?.fullName ?? 'Anon'
          } has been successfully deleted`
        );
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      },
      onError: (err) => {
        toast.error(
          `Something went wrong whilst trying to delete this booking
        ERROR: ${err.message}`
        );
      },
    });

  return { deleteBookingMutate, isDeletingBooking };
}
