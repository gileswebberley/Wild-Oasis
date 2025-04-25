import styled from 'styled-components';
import { useRecentBookings } from './useRecentBookings';
import { useRecentStays } from './useRecentStays';
import Spinner from '../../ui/Spinner';
import Statistics from './Statistics';
import { useCabins } from '../cabins/useCabins';
import SalesChart from './SalesChart';
import DurationChart from './DurationChart';
import TodayActivity from '../check-in-out/TodayActivity';

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { isLoadingRecentBookings, recentBookings, numDays } =
    useRecentBookings();
  const { isLoadingRecentStays, recentStays, confirmedStays } =
    useRecentStays();

  //we need the number of cabins available for the occupancy rate
  const { isLoading: isLoadingCabinCount, count: cabinsCount } = useCabins();
  const isLoadingData =
    isLoadingRecentBookings || isLoadingRecentStays || isLoadingCabinCount;

  if (isLoadingData) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Statistics
        bookings={recentBookings}
        stays={confirmedStays}
        period={numDays}
        cabinCount={cabinsCount}
      />
      <TodayActivity />
      <DurationChart stays={confirmedStays} period={numDays} />
      <SalesChart bookings={recentBookings} period={numDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
