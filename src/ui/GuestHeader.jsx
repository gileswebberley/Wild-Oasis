import styled, { css } from 'styled-components';
import UserAvatar from '../features/authentication/UserAvatar';
import DarkModeToggle from './DarkModeToggle';
import { useUser } from '../features/authentication/useUser';
import LogoSmall from './LogoSmall';
import GuestLogin from '../features/guest/GuestLogin';
import Login from '../features/authentication/Login';
import Logout from '../features/authentication/Logout';
import UserHome from '../features/authentication/UserHome';
import { useDarkMode } from '../context/DarkModeContext';
import { bp_sizes } from '../styles/breakpoints';
import CabinSketchHeading from './CabinSketchHeading';

//I made the dark mode change the baground gradient because it looked better with the theme affected buttons
const StyledHeader = styled.header`
  display: flex;
  position: relative;
  justify-content: space-between;
  /* align-items: flex-end; */
  padding-left: 3%;
  ${(props) =>
    props.$dark
      ? css`
          background: linear-gradient(
            120deg,
            var(--color-brand-500) 40%,
            var(--color-brand-900)
          );
        `
      : css`
          background: linear-gradient(
            30deg,
            var(--color-brand-900) 40%,
            var(--color-brand-500)
          );
        `}
  border-bottom: 3px solid var(--color-yellow-700);
`;

const HeaderNav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 0.8rem;
  padding: 1.2rem 2.2rem;
`;
const HeaderNavSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
`;

const HeaderTagline = styled.span`
  color: var(--color-brown);
  transform: rotate(-0.5deg) translateY(2.5rem); // translateX(-1rem);
  @media (${bp_sizes.lg}) {
    display: none;
  }
`;

function GuestHeader() {
  const { isAuthenticated, isAnonymous } = useUser();
  const { isDarkMode } = useDarkMode();
  return (
    <StyledHeader $dark={isDarkMode}>
      <LogoSmall />
      <HeaderTagline>
        <CabinSketchHeading style={{ color: 'var(--color-brown)' }} as="h1">
          &#xFF02;Not All Who Wander Are Lost&#xFF02;
        </CabinSketchHeading>
      </HeaderTagline>
      <HeaderNav>
        {(isAnonymous || isAuthenticated) && (
          <HeaderNavSection>
            <UserAvatar guest={true} />
            <Logout guest={true} />
          </HeaderNavSection>
        )}
        <HeaderNavSection>
          {!isAuthenticated ? (
            <Login guest={true} />
          ) : (
            <UserHome guest={true} />
          )}
          <DarkModeToggle guest={true} />
        </HeaderNavSection>
      </HeaderNav>
    </StyledHeader>
  );
}

export default GuestHeader;
