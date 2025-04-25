import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function useCheckIn() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading: isCheckingIn, mutate: checkIn } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        isPaid: true,
        status: 'checked-in',
      }),

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked in`);
      queryClient.invalidateQueries({ active: true });
      navigate(-1);
    },

    onError: (error) => {
      toast.error(`Something went wrong whilst trying to check in this booking
        ERROR: ${error.message}`);
    },
  });

  const { isLoading: isAddingBreakfast, mutate: addBreakfastWithCheckIn } =
    useMutation({
      mutationFn: ({ bookingId, breakfastPrice, newTotal }) =>
        updateBooking(bookingId, {
          hasBreakfast: true,
          extrasPrice: breakfastPrice,
          totalPrice: newTotal,
        }),

      onSuccess: (data) => {
        toast.success(`Successfully added breakfast to booking #${data.id}`);
        checkIn(data.id);
      },

      onError: (error) => {
        toast.error(`Something went wrong whilst trying to add breakfast to this booking
        ERROR: ${error.message}`);
      },
    });

  return { isCheckingIn, checkIn, isAddingBreakfast, addBreakfastWithCheckIn };
}
