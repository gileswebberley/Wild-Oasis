import styled from 'styled-components';
import SortBy from '../../ui/SortBy';

const StyledCabinSelectSort = styled.span`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

function CabinSelectSort() {
  return (
    <StyledCabinSelectSort>
      <SortBy
        label="Sort"
        sortField="cabins-sort"
        options={[
          { value: 'regularPrice-asc', label: 'Price (Low-High)' },
          { value: 'regularPrice-desc', label: 'Price (High-Low)' },
          { value: 'maxCapacity-asc', label: 'Capacity (Low-High)' },
          { value: 'maxCapacity-desc', label: 'Capacity (High-Low)' },
        ]}
      />
    </StyledCabinSelectSort>
  );
}

export default CabinSelectSort;
