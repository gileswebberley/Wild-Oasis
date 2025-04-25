import Filter from '../../ui/Filter';
import SortBy from '../../ui/SortBy';
import TableOperations from '../../ui/TableOperations';
import { IS_PAGINATED } from '../../utils/shared_constants';

function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        isPaginated={IS_PAGINATED.cabins}
        filterField="discount"
        options={[
          { value: 'all', label: 'All' },
          { value: 'no-discount', label: 'No Discount' },
          { value: 'with-discount', label: 'With Discount' },
        ]}
      />
      <SortBy
        label="Sort"
        sortField="cabins-sort"
        options={[
          { value: 'name-asc', label: 'Name (A-Z)' },
          { value: 'name-desc', label: 'Name (Z-A)' },
          { value: 'regularPrice-asc', label: 'Price (Low-High)' },
          { value: 'regularPrice-desc', label: 'Price (High-Low)' },
          { value: 'maxCapacity-asc', label: 'Capacity (Low-High)' },
          { value: 'maxCapacity-desc', label: 'Capacity (High-Low)' },
          { value: 'discount-asc', label: 'Discount (Low-High)' },
          { value: 'discount-desc', label: 'Discount (High-Low)' },
          { value: 'id-asc', label: 'Oldest' },
          { value: 'id-desc', label: 'Most Recent' },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
