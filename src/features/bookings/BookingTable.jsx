import BookingRow from './BookingRow';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Empty from '../../ui/Empty';
import Spinner from '../../ui/Spinner';
import { useBookings } from './useBookings';
import Pagination from '../../ui/Pagination';
import { IS_PAGINATED } from '../../utils/shared_constants';

function BookingTable() {
  const { isLoading, bookings, count, error } = useBookings();

  if (isLoading) return <Spinner />;
  if (error) return <div>ERROR: {error}</div>;

  if (!bookings?.length) return <Empty resource="Bookings" />;
  return (
    <Menus>
      <Table columns="1fr 1.8fr 2.4fr 1fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={bookings}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />
        <Table.Footer>
          {IS_PAGINATED.bookings && <Pagination resultCount={count} />}
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;
