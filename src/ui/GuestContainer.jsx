import styled from 'styled-components';
import { bp_sizes } from '../styles/breakpoints';

//Define the grid when using this basic component
const GuestContainer = styled.div`
  max-width: 78rem;
  display: grid;
  gap: 3rem;
  /* grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr; */
  padding: 2.4rem 4rem;
  margin: 1rem 1rem;
  background-color: var(--color-grey-100-alpha);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-xl);
  @media (${bp_sizes.sm}) {
    padding: 1rem 1.5rem;
  }
`;

export default GuestContainer;
