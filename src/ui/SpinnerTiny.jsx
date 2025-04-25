import styled, { keyframes } from 'styled-components';
import { BiLoaderAlt } from 'react-icons/bi';

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;

const SpinnerTiny = styled(BiLoaderAlt)`
  width: 1.2rem;
  height: 1.2rem;
  animation: ${rotate} 1.5s infinite linear;
`;

export default SpinnerTiny;
