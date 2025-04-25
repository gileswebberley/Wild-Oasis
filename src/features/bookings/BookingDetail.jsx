import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useCheckOut } from '../check-in-out/useCheckOut';
import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from './useBooking';
import { useDeleteBooking } from './useDeleteBooking';

import BookingDataBox from './BookingDataBox';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';
import Spinner from '../../ui/Spinner';
import CompoundModal from '../../ui/CompoundModal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import SpinnerTiny from '../../ui/SpinnerTiny';
import { HiTrash } from 'react-icons/hi2';
import SimpleFormRow from '../../ui/SimpleFormRow';
import Empty from '../../ui/Empty';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { isLoading, booking } = useBooking();
  const { checkOut, isCheckingOut } = useCheckOut();
  const { deleteBookingMutate, isDeletingBooking } = useDeleteBooking();
  const navigate = useNavigate();
  //console.table(booking);
  const moveBack = useMoveBack();

  if (isLoading) return <Spinner />;

  if (!booking)
    return (
      <Row type="horizontal">
        <Empty resource="booking" />
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>
    );

  const {
    id: bookingId,
    status,
    guests: { fullName: guestName },
  } = booking ?? {};

  //within Tag these are used to dynamically create the colour name eg --color-blue-700
  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking {bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <CompoundModal>
        <CompoundModal.Modal contentName="delete">
          <ConfirmDelete
            resourceName={`booking for ${guestName}`}
            onConfirm={() =>
              deleteBookingMutate(bookingId, {
                onSettled: () => navigate(-1),
              })
            }
            disabled={isDeletingBooking}
          />
        </CompoundModal.Modal>
        {/* Allow for checking in when unconfirmed and checking out when checked in */}
        <SimpleFormRow>
          <ButtonGroup>
            {status === 'unconfirmed' && (
              <Button
                variation="primary"
                size="medium"
                onClick={() => navigate(`../checkin/${bookingId}`)}
              >
                <p>Check-In</p>
              </Button>
            )}

            {status === 'checked-in' && (
              <Button
                variation="primary"
                size="medium"
                disabled={isCheckingOut}
                onClick={() => checkOut(bookingId)}
              >
                <p>Check-Out</p>
              </Button>
            )}
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
            <Button variation="secondary" onClick={moveBack}>
              Back
            </Button>
          </ButtonGroup>
        </SimpleFormRow>
      </CompoundModal>
    </>
  );
}

export default BookingDetail;
