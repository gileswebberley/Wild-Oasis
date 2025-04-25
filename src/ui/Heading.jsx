import styled, { css } from 'styled-components';

//The 'as' prop is built in and produces the appropriate html output, ie an <h1> <h2> or <h3> element which is good for accessibility and SEO. If we didn't use 'as' we would end up with all of them being rendered as <h1> elements
const Heading = styled.h1`
  ${(props) =>
    props.as === 'h1' &&
    css`
      font-size: 4rem;
      font-weight: 700;
    `}

  ${(props) =>
    props.as === 'h2' &&
    css`
      font-size: 3rem;
      font-weight: 600;
    `}
    
    ${(props) =>
    props.as === 'h3' &&
    css`
      font-size: 2rem;
      font-weight: 500;
    `}

    
    ${(props) =>
    props.as === 'h4' &&
    css`
      font-size: 1.5rem;
      font-weight: 400;
    `}
    
  line-height: 1.4;
  text-wrap: balance;
`;

export default Heading;
