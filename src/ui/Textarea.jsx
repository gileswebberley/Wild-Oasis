import styled from 'styled-components';
import { bp_sizes } from '../styles/breakpoints';

const Textarea = styled.textarea`
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: 5px;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  min-width: 20rem;
  height: 8rem;
  @media (${bp_sizes.sm}) {
    min-width: 100%;
    min-height: 10rem;
  }
`;

export default Textarea;
