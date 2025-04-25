import styled from 'styled-components';
import Empty from '../../ui/Empty';
import Spinner from '../../ui/Spinner';
import CabinDetailsBox from './CabinDetailsBox';
import { useCabins } from '../cabins/useCabins';
import { useCabinFilters } from '../cabins/useCabinFilters';
import CabinSelectSort from './CabinSelectSort';
import SlideInY from '../../ui/SlideInY';
import CabinSketchHeading from '../../ui/CabinSketchHeading';

const StyledCabinSelect = styled.div`
  display: flex;
  /* min-height: 0 is to fix a firefox quirk where the cabins were scrolling off the top of the page */
  min-height: 0;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3rem;
  padding: 1.5rem 0;
`;

function CabinSelect() {
  const { isLoading, cabins, error, count } = useCabins();

  // let paginationCount = count;
  //sorting and filtering are defined in the url - see the CabinTableOperations component
  // const [searchParams] = useSearchParams();
  let { filteredCabins } = useCabinFilters(cabins ?? {});

  if (isLoading) return <Spinner />;
  if (error) return <div>ERROR: {error}</div>;
  if (cabins.length === 0) return <Empty resource="Cabins" />;

  return (
    <>
      <SlideInY>
        <CabinSketchHeading as="h1">
          Let&#39;s Find Your Perfect Cabin
        </CabinSketchHeading>
        <CabinSelectSort />
        <StyledCabinSelect>
          {filteredCabins.map((cabin) => (
            <CabinDetailsBox cabin={cabin} key={cabin.id} />
          ))}
        </StyledCabinSelect>
      </SlideInY>
    </>
  );
}

export default CabinSelect;
