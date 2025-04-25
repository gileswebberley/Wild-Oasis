import styled from 'styled-components';
import SlideInY from '../../ui/SlideInY';
import { bp_sizes } from '../../styles/breakpoints';
import { formatCurrency } from '../../utils/helpers';
import { useBookingDates } from '../bookings/useBookingDates';
import SpinnerMini from '../../ui/SpinnerMini';
import CabinDatePicker from './CabinDatePicker';
import CabinSketchHeading from '../../ui/CabinSketchHeading';
import GuestParagraph from '../../ui/GuestParagraph';
import { useUser } from '../authentication/useUser';
import Button from '../../ui/Button';
import { useNavigate } from 'react-router-dom';

const StyledCabinDetailsBox = styled.div`
  display: block;
  background-color: var(--color-grey-100-alpha);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-xl);
  padding: 3rem;
  min-width: 26rem;
  max-width: 88rem;
  /* width: 88rem; */
`;

const DetailsLayout = styled.section`
  display: flex;
  flex-direction: column;
  /* justify-content: flex-end;
  align-content: flex-end; */
  gap: 1.5rem;
  padding: 2rem;
  color: var(--color-green-700);
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-md);
`;

const DetailsRow = styled.article`
  display: grid;
  /* background-color: red; */
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
  gap: 0.9rem;
  border-top: 2px solid var(--color-green-700);
  color: var(--color-grey-800);
  padding: 1rem;
  @media ${bp_sizes.sm} {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const CabinImg = styled.img`
  align-self: end;
  grid-column: 1;
  min-width: 18rem;
  width: 28rem;
`;

const Paragraph = styled(GuestParagraph)`
  overflow: auto;
  height: 19rem;
`;

const HeadingContainer = styled.span`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  //convert to a column on small screens
  @media ${bp_sizes.sm} {
    flex-direction: column;
  }
`;

function CabinDetailsBox({ cabin }) {
  // console.log(cabin.id);
  const navigate = useNavigate();
  const { isCheckingUser, isAuthenticated, isAnonymous } = useUser();
  const { isLoading, error, bookingDates } = useBookingDates(cabin.id);

  if (error) return <div>ERROR: {error}</div>;
  if (isCheckingUser || isLoading) return null;

  // function handleSelection() {}

  return (
    <SlideInY>
      <StyledCabinDetailsBox>
        <DetailsLayout>
          <HeadingContainer>
            <CabinSketchHeading as="h2" style={{ textAlign: 'left' }}>
              {cabin.name}
              <br /> for {cabin.maxCapacity} Guests
            </CabinSketchHeading>
            <CabinSketchHeading as="h3" style={{ textAlign: 'right' }}>
              {formatCurrency(cabin.regularPrice - cabin.discount)} per night{' '}
              <br />
              {cabin.discount > 0 &&
                'with ' + formatCurrency(cabin.discount) + ' off'}
            </CabinSketchHeading>
          </HeadingContainer>
          <DetailsRow>
            <CabinImg
              src={cabin.imageUrl}
              loading="lazy"
              alt={`Image of Cabin ${cabin.name}`}
            />
            <div>
              <Paragraph>{cabin.description}</Paragraph>
            </div>
          </DetailsRow>
          {isLoading ? (
            <SpinnerMini />
          ) : isAuthenticated || isAnonymous ? (
            <CabinDatePicker
              reservedDates={bookingDates}
              cabinId={cabin.id}
              // onSelected={handleSelection}
            />
          ) : (
            <Button
              size="small"
              variation="secondary"
              $guest={true}
              onClick={() => navigate('../guest')}
            >
              Please Sign Up To Book <br /> or check availability
            </Button>
          )}
          {/* </DetailsRow> */}
        </DetailsLayout>
      </StyledCabinDetailsBox>
    </SlideInY>
  );
}

export default CabinDetailsBox;
