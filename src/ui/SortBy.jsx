import { useSearchParams } from 'react-router-dom';
import Menus from './Menus';
import styled, { css } from 'styled-components';

const SortButton = styled.button`
  text-align: center;
  font-size: 1.4rem;
  font-weight: 300;
  border: 1px solid var(--color-grey-200);
  background-color: var(--color-grey-100);
  padding: 0.4rem;
  white-space: nowrap;
  width: 100%;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-500);
    color: var(--color-brand-100);
  }

  ${(props) =>
    props.active === 'true' &&
    css`
      background-color: var(--color-brand-200);
      color: var(--color-brand-600);
    `}

  transition: all 0.2s;
`;

function SortBy({ sortField, options, label }) {
  //add the sorting method to the url
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSort = searchParams.get(sortField);

  function handleClick(value) {
    searchParams.set(sortField, value);
    setSearchParams(searchParams);
  }

  return (
    <Menus>
      <Menus.Menu>
        <Menus.Toggle menuId={sortField} label={label} />
        <Menus.List menuId={sortField} direction="column">
          {options?.map((option, i) => {
            const isActive = selectedSort === option.value ? 'true' : undefined;
            return (
              <Menus.Button key={i}>
                <SortButton
                  active={isActive}
                  disabled={Boolean(isActive)}
                  onClick={() => handleClick(option.value)}
                >
                  {option.label}
                </SortButton>
              </Menus.Button>
            );
          })}
        </Menus.List>
      </Menus.Menu>
    </Menus>
  );
}

export default SortBy;
