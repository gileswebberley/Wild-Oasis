import styled from 'styled-components';
import { useDarkMode } from '../context/DarkModeContext';
import { useNavigate } from 'react-router-dom';

const StyledLogo = styled.div`
  text-align: center;
  padding: 1.2rem 1.2rem;
  cursor: pointer;
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;

function Logo() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  return (
    <StyledLogo onClick={() => navigate('../', { replace: true })}>
      <Img src={isDarkMode ? '/logo-dark.png' : '/logo-light.png'} alt="Logo" />
    </StyledLogo>
  );
}

export default Logo;
