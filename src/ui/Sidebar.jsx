import styled, { css } from 'styled-components';
import { useState } from 'react';
import Logo from './Logo';
import MainNav from './MainNav';
import Uploader from '../data/Uploader';
import { useClickOutside } from '../hooks/useClickOutside';

//going to try to make this a collapsing menu
const transform = {
  open: css`
    transform: translate(0);
    transition: transform ease-in-out 0.8s;
  `,

  closed: css`
    transform: translate(-94%);
    transition: transform ease-in-out 0.4s;
  `,
};

//now that this is within a grid layout (in StyledAppLayout) it becomes a grid-item. To make it span from row 1 to the end of the grid rows we set it as 1 / -1
const StyledSidebar = styled.aside`
  display: grid;
  grid-template-columns: 26rem 1.5rem;
  grid-template-rows: auto 1fr auto;
  height: 100dvh;
  gap: 2.2rem;
  background-color: var(--color-grey-0);
  padding: 0.4rem 0.2rem;
  position: absolute;
  z-index: 11;
  ${(props) => transform[props.transform]}
`;

const ClickBit = styled.div`
  background-color: var(--color-brand-600);
  border-radius: 0.5rem;
  grid-column: 2;
  grid-row: 1/-1;
`;

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const clickOutsideRef = useClickOutside(() => setIsOpen(false));

  function handleOpen(e) {
    //for use in tablets where there is no mouse tracking to open it and also to make it close when a menu item is clicked
    e.preventDefault();
    setIsOpen((open) => !open);
  }

  function handleLeave(e) {
    if (e.clientX < 0 || e.clientY < 0 || e.clientY > window.innerHeight) {
      //to avoid immediately closing if the mouse goes too far to the left when opening, also thought I may as well keep it open if the mouse goes into the toolbar or dev-tools
      return;
    }
    setIsOpen(false);
  }
  return (
    <StyledSidebar
      transform={isOpen ? 'open' : 'closed'}
      onPointerDown={handleOpen}
      onMouseLeave={handleLeave}
      ref={clickOutsideRef}
    >
      <Logo />
      <ClickBit
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => {
          if (!isOpen) setIsOpen(true);
        }}
      />
      <MainNav />
      <Uploader />
    </StyledSidebar>
  );
}

export default Sidebar;
