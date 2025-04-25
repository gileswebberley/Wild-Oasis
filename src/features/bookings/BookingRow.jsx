import styled from 'styled-components';
import { format, isToday } from 'date-fns';
import { formatCurrency } from '../../utils/helpers';
import { formatDistanceFromNow } from '../../utils/helpers';

import {
  HiArrowDownOnSquareStack,
  HiArrowUpOnSquareStack,
  HiEye,
  HiTrash,
} from 'react-icons/hi2';
import Tag from '../../ui/Tag';
import Table from '../../ui/Table';
import SpinnerTiny from '../../ui/SpinnerTiny';
import CompoundModal from '../../ui/CompoundModal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Menus from '../../ui/Menus';
import Button from '../../ui/Button';

import { useNavigate } from 'react-router-dom';
import { useCheckOut } from '../check-in-out/useCheckOut';
import { useDeleteBooking } from './useDeleteBooking';

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
`;
//notice that we are using the db table names for the guest and cabin as they are referred to in the getBookings function in apiBookings
function BookingRow({
  booking: {
    id: bookingId,
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    totalPrice,
    status,
    guests: { fullName: guestName, email },
    cabins: { name: cabinName },
  },
}) {
  const navigate = useNavigate();

  const { checkOut, isCheckingOut } = useCheckOut();
  const { deleteBookingMutate, isDeletingBooking } = useDeleteBooking();

  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
  };

  return (
    <Table.Row>
      <Cabin>{cabinName}</Cabin>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(startDate))
            ? 'Today'
            : formatDistanceFromNow(startDate)}{' '}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), 'MMM dd yyyy')} &mdash;{' '}
          {format(new Date(endDate), 'MMM dd yyyy')}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>

      {/* Putting in the modal compound component for the delete confirmation pop-up */}
      <CompoundModal>
        <CompoundModal.Modal contentName="delete">
          <ConfirmDelete
            resourceName={`booking for ${guestName}`}
            onConfirm={() => deleteBookingMutate(bookingId)}
            disabled={isDeletingBooking}
          />
        </CompoundModal.Modal>
        <Menus.Menu>
          <Menus.Toggle menuId={bookingId} />
          <Menus.List menuId={bookingId} direction="column">
            <Menus.Button>
              <Button
                variation="secondary"
                size="small"
                onClick={() => navigate(`../bookings/${bookingId}`)}
              >
                <HiEye />
                <p>Details</p>
              </Button>
            </Menus.Button>
            {status === 'unconfirmed' && (
              <Menus.Button>
                <Button
                  variation="secondary"
                  size="small"
                  onClick={() => navigate(`../checkin/${bookingId}`)}
                >
                  <HiArrowDownOnSquareStack />
                  <p>Check-In</p>
                </Button>
              </Menus.Button>
            )}
            {status === 'checked-in' && (
              <Menus.Button>
                <Button
                  variation="secondary"
                  size="small"
                  disabled={isCheckingOut}
                  onClick={() => checkOut(bookingId)}
                >
                  <HiArrowUpOnSquareStack />
                  <p>Check-Out</p>
                </Button>
              </Menus.Button>
            )}
            <Menus.Button>
              <CompoundModal.Open openName="delete">
                <Button
                  variation="danger"
                  size="small"
                  disabled={isDeletingBooking}
                >
                  {isDeletingBooking ? <SpinnerTiny /> : <HiTrash />}
                  <p>Delete</p>
                </Button>
              </CompoundModal.Open>
            </Menus.Button>
          </Menus.List>
        </Menus.Menu>
      </CompoundModal>
    </Table.Row>
  );
}

export default BookingRow;
