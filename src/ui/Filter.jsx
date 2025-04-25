import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { IS_PAGINATED } from '../utils/shared_constants';

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

function Filter({ filterField, options, isPaginated = false }) {
  //to add our filter to the url (so it can be seen by the cabins table)
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get(filterField); //|| options.at(0).value;

  useEffect(() => {
    if (!activeFilter) {
      searchParams.set(filterField, options.at(0).value);
      setSearchParams(searchParams);
    }
  }, [activeFilter, filterField, options, searchParams, setSearchParams]);

  function handleClick(value) {
    //create the url param (name, value)
    searchParams.set(filterField, value);
    //because we have now implemented pagination - if we filter the results it can lead to an out of bounds request from the database (eg we get to results 16-20 and then filter for 'checked-in' but there are only 10 of them, the request still tries to get the range which are no longer being fetched)
    if (isPaginated) {
      searchParams.set(IS_PAGINATED.NAME, 1);
    }
    //then add it to the url
    setSearchParams(searchParams);
  }

  return (
    <StyledFilter>
      {options.map((option, i) => {
        const isActive = activeFilter === option.value ? 'true' : undefined;
        return (
          <FilterButton
            key={i}
            onClick={() => handleClick(option.value)}
            active={isActive}
            disabled={Boolean(isActive)}
          >
            {option.label}
          </FilterButton>
        );
      })}
    </StyledFilter>
  );
}
export default Filter;
