import styled, { css } from 'styled-components';
import { bp_sizes } from '../styles/breakpoints';

const StyledButtonGroup = styled.nav`
  display: flex;
  width: 100%;
  ${(props) =>
    props.$justify === 'end'
      ? css`
          justify-content: flex-end;
        `
      : css`
          justify-content: flex-start;
        `};
`;

const ButtonSet = styled.nav`
  display: flex;
  gap: 1.2rem;
  width: 100%;
  max-width: fit-content;
  @media (${bp_sizes.sm}) {
    flex-direction: column;
  }
`;
// set justify prop to change positioning, ie 'end' for the right and 'start' for the left
function ButtonGroup({ children, justify = 'end' }) {
  return (
    <StyledButtonGroup $justify={justify}>
      <ButtonSet>{children}</ButtonSet>
    </StyledButtonGroup>
  );
}

export default ButtonGroup;
