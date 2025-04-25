import { useSearchParams } from 'react-router-dom';

export function useCabinFilters(cabins) {
  //sorting and filtering are defined in the url - see the CabinTableOperations component
  const [searchParams] = useSearchParams();

  if (cabins.length === 0) {
    console.log(cabins);
    return;
  }

  //SORTING - if no sorting method is selected then sort by most recently created (namely the id)
  const sort = searchParams.get('cabins-sort') ?? 'id';
  let sortedCabins;

  const [sortCat, sortDir] = sort.split('-');
  const directionModifier = sortDir === 'asc' ? 1 : -1;
  if (sortCat === 'name') {
    //it's a string comparison
    sortedCabins = cabins?.sort?.(
      (a, b) => directionModifier * a.name.localeCompare(b.name)
    );
  } else {
    //it's numerical comparison
    sortedCabins = cabins?.sort?.(
      (a, b) => directionModifier * (a[sortCat] - b[sortCat])
    );
  }

  //FILTERING
  const filter = searchParams.get('discount') ?? 'all';
  let filteredCabins;

  switch (filter) {
    case 'all':
      filteredCabins = sortedCabins;
      break;
    case 'no-discount':
      filteredCabins = sortedCabins.filter((cabin) => cabin.discount === 0);
      break;
    case 'with-discount':
      filteredCabins = sortedCabins.filter((cabin) => cabin.discount > 0);
      break;
    default:
      filteredCabins = sortedCabins;
  }

  return { filteredCabins, searchParams };
}
