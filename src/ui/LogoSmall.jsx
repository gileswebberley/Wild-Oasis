import styled from 'styled-components';
import { useDarkMode } from '../context/DarkModeContext';
import { useNavigate } from 'react-router-dom';

const StyledLogo = styled.div`
  text-align: center;
  padding: 1.2rem 1.2rem;
  cursor: pointer;
`;

const Img = styled.img`
  height: 7.6rem;
  width: auto;
`;
//for use in guest header
function LogoSmall() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  return (
    <StyledLogo onClick={() => navigate('../', { replace: true })}>
      <Img src={isDarkMode ? '/logo-light.png' : '/logo-dark.png'} alt="Logo" />
    </StyledLogo>
  );
}

export default LogoSmall;
