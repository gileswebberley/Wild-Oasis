import styled from 'styled-components';
import { bp_sizes } from '../styles/breakpoints';

const SimpleFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1.2fr 1fr;

  gap: 2.4rem;

  padding: 1.2rem 0;

  //convert to a column on small screens
  @media ${bp_sizes.sm} {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

SimpleFormRow.defaultProps = {
  role: 'row',
};

export default SimpleFormRow;
