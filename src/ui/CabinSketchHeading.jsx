import styled, { css } from 'styled-components';
import { bp_sizes } from '../styles/breakpoints';

//This font only has weights of 700 and 400
const CabinSketchHeading = styled.h1`
  font-family: 'Cabin Sketch', sans-serif;
  color: var(--color-green-700);
  ${(props) =>
    props.as === 'h1' &&
    css`
      font-size: 6rem;
      font-weight: 700;
      @media (${bp_sizes.sm}) {
        font-size: 5rem;
      }
    `}

  ${(props) =>
    props.as === 'h2' &&
    css`
      font-size: 4rem;
      font-weight: 700;
      @media (${bp_sizes.sm}) {
        font-size: 3rem;
      }
    `}
    
    ${(props) =>
    props.as === 'h3' &&
    css`
      font-size: 3rem;
      font-weight: 400;
      @media (${bp_sizes.sm}) {
        font-size: 2.5rem;
      }
    `}

    
    ${(props) =>
    props.as === 'h4' &&
    css`
      font-size: 2rem;
      font-weight: 400;
      @media (${bp_sizes.sm}) {
        font-size: 1.5rem;
      }
    `}
    
  line-height: 1.1;
  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
  text-wrap: pretty;
  text-align: center;
  user-select: none;
`;
export default CabinSketchHeading;
