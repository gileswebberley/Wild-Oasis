import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createBooking } from '../../services/apiBookings';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  const { mutate: createBookingMutate, isLoading: isCreatingBooking } =
    useMutation({
      mutationFn: createBooking,
      onSuccess: () => {
        // console.table(data);
        toast.success(`Booking has been successfully created`);
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      },
      onError: (err) => {
        toast.error(
          `Something went wrong whilst trying to create this booking
        ERROR: ${err.message}`
        );
      },
    });

  return { createBookingMutate, isCreatingBooking };
}
