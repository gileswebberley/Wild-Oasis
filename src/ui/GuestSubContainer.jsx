import styled from 'styled-components';
import { bp_sizes } from '../styles/breakpoints';

//Define the grid when using this basic component
const GuestSubContainer = styled.div`
  padding: 2.4rem 4rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  @media (${bp_sizes.sm}) {
    padding: 1rem 1.5rem;
  }
  overflow: auto;
  font-size: 1.4rem;
`;

export default GuestSubContainer;
