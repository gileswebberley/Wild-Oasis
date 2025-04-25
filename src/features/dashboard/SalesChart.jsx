import styled from 'styled-components';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';
import { useDarkMode } from '../../context/DarkModeContext';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import DashboardBox from './DashboardBox';
import Heading from '../../ui/Heading';

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

//using npm recharts
function SalesChart({ bookings, period }) {
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode
    ? {
        totalSales: { stroke: '#4f46e5', fill: '#4f46e5' },
        extrasSales: { stroke: '#22c55e', fill: '#22c55e' },
        text: '#e5e7eb',
        background: '#18212f',
      }
    : {
        totalSales: { stroke: '#4f46e5', fill: '#c7d2fe' },
        extrasSales: { stroke: '#16a34a', fill: '#dcfce7' },
        text: '#374151',
        background: '#fff',
      };

  const dates = eachDayOfInterval({
    start: subDays(new Date(), period),
    end: new Date(),
  });
  // console.log(dates);

  const data = dates.map((date) => {
    return {
      label: format(date, 'MMM dd'),
      totalSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => (acc += cur.totalPrice), 0),
      extrasSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => (acc += cur.extrasPrice), 0),
    };
  });

  const sales = bookings.reduce((acc, cur) => (acc += cur.totalPrice), 0);

  return (
    <StyledSalesChart>
      <Heading as="h2">
        Sales from {format(dates.at(0), 'do MMM yyyy')} to{' '}
        {format(dates.at(-1), 'do MMM yyyy')}
      </Heading>
      {sales === 0 ? (
        'No Sales to map'
      ) : (
        <ResponsiveContainer width="100%" height={sales ? 300 : 0}>
          <AreaChart data={data} margin={{ bottom: 15 }}>
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis
              aria-label="Day"
              dataKey="label"
              tick={{ fill: colors.text }}
              tickLine={{ stroke: colors.text }}
            />
            <YAxis
              aria-label="Amount in GBP"
              tick={{ fill: colors.text }}
              tickLine={{ stroke: colors.text }}
            />
            <Tooltip contentStyle={{ backgroundColor: colors.background }} />
            <Legend />
            <Area
              dataKey="totalSales"
              type="monotone"
              {...colors.totalSales}
              name="Total Sales"
              unit=" GBP"
            />

            <Area
              dataKey="extrasSales"
              type="monotone"
              {...colors.extrasSales}
              name="Extras Sold"
              unit=" GBP"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </StyledSalesChart>
  );
}

export default SalesChart;
