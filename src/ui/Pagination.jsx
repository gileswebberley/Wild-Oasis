import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { PAGE_SIZE, IS_PAGINATED } from '../utils/shared_constants';

const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const P = styled.p`
  font-size: 1.4rem;
  /* margin-left: 0.8rem; */

  & span {
    font-weight: 600;
  }
`;

const PaginationButton = styled.button`
  background-color: ${(props) =>
    props.active ? ' var(--color-brand-600)' : 'var(--color-grey-50)'};
  color: ${(props) => (props.active ? ' var(--color-brand-50)' : 'inherit')};
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:has(span:last-child) {
    padding-left: 0.4rem;
  }

  &:has(span:first-child) {
    padding-right: 0.4rem;
  }

  & svg {
    height: 1.8rem;
    width: 1.8rem;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }

  &:hover:active {
    background-color: var(--color-grey-200);
    color: var(--color-grey-50);
  }

  &:disabled {
    background-color: var(--color-grey-200);
    color: var(--color-grey-50);
  }

  &:focus {
    outline: none;
  }
`;

function Pagination({ resultCount }) {
  //grab the page number from the url
  const [searchParams, setSearchParams] = useSearchParams();
  const pageCount = Math.ceil(resultCount / PAGE_SIZE);
  //if there's only one page's worth of results then don't display this at all
  if (pageCount <= 1) return null;

  let currentPage = 1;
  const paramPage = searchParams.get(IS_PAGINATED.NAME);
  if (paramPage) currentPage = Number(paramPage);

  const hasNext = currentPage < pageCount;
  const hasPrev = currentPage > 1;

  function changePage(pageNumber) {
    searchParams.set(IS_PAGINATED.NAME, pageNumber);
    setSearchParams(searchParams);
  }

  function next() {
    if (hasNext) changePage(currentPage + 1);
  }
  function prev() {
    if (hasPrev) changePage(currentPage - 1);
  }

  return (
    <StyledPagination>
      {/* <Buttons> */}
      <PaginationButton onClick={prev} disabled={!hasPrev}>
        <HiChevronLeft />
        Previous
      </PaginationButton>
      <P>
        Showing
        <span> {1 + (currentPage - 1) * PAGE_SIZE} </span>to
        <span> {hasNext ? currentPage * PAGE_SIZE : resultCount} </span>of
        <span> {resultCount} results</span>
      </P>

      <PaginationButton onClick={next} disabled={!hasNext}>
        Next
        <HiChevronRight />
      </PaginationButton>

      {/* </Buttons> */}
    </StyledPagination>
  );
}

export default Pagination;
