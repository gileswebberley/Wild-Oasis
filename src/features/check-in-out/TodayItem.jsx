import styled from 'styled-components';
import Tag from '../../ui/Tag';
import { Flag } from '../../ui/Flag';
import Button from '../../ui/Button';
import { Link } from 'react-router-dom';
import ButtonGroup from '../../ui/ButtonGroup';
import CheckoutButton from './CheckoutButton';

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 0.8fr 9rem;
  gap: 1.2rem;
  align-items: center;
  justify-content: space-between;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

function TodayItem({ activity }) {
  const { id, status, guests, numNights } = activity;
  return (
    <StyledTodayItem>
      {status === 'unconfirmed' && <Tag type="green">Arriving</Tag>}
      {status === 'checked-in' && <Tag type="blue">Departing</Tag>}
      <Flag src={guests.countryFlag} alt="Flag of guests country" />
      <Guest>{guests.fullName}</Guest>
      {/* <div>{numNights} nights</div> */}
      <div></div>
      <ButtonGroup>
        {status === 'unconfirmed' && (
          <Button
            size="small"
            variation="primary"
            as={Link}
            to={`../checkin/${id}`}
          >
            Check In
          </Button>
        )}

        {status === 'checked-in' && <CheckoutButton bookingId={id} />}
      </ButtonGroup>
    </StyledTodayItem>
  );
}

export default TodayItem;
