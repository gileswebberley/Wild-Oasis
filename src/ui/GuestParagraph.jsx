import styled from 'styled-components';

const GuestParagraph = styled.p`
  text-wrap: balance;
  text-align: justify;
  //stop words from being broken across lines
  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
  user-select: none;
`;

export default GuestParagraph;
