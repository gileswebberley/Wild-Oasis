import { createContext, useContext, useRef, useState } from 'react';
import { HiEllipsisVertical } from 'react-icons/hi2';
import styled from 'styled-components';
import { useClickOutside } from '../hooks/useClickOutside';

/**
 * The styled div that we wrap our Menus.List and Menus.Toggle inside
 * @memberof Menus
 */
const Menu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0.44rem 0.8rem;
  font-weight: 500;
  font-size: 1.4rem;
  /* border-radius: 50%; */
  border-radius: var(--border-radius-sm);
  /* transform: translateX(0.8rem); */
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-300);
  }

  &:focus {
    outline: var(--color-grey-300) solid 2px;
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: absolute;
  z-index: 10;
  width: fit-content;
  height: fit-content;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-lg);
  border-radius: var(--border-radius-md);
  /* Don't need the styled button we can just pass our styled buttons in as children of this list */
  display: flex;
  flex-direction: ${(props) => props.direction};
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const MenuContext = createContext();

/**
 *  A compound pattern context menu system. If multiple menus are available then wrap the entire section in this Menus component as this acts as the context provider for the system
 * @member Menu Container
 * @member Toggle - Child of Menus.Menu Toggle button to open and close the context menu
 * @member List - Child of Menus.Menu The actual context menu that opens
 * @member Button Components that are the children of the List
 *
 * @param {Object} props
 * @param {Component} props.children automatically generated children prop which should be a Menus.Menu
 * @returns
 */
function Menus({ children }) {
  //similar process to the modal windows - keep a reference to the currently open menu
  const [openId, setOpenId] = useState('');
  const [position, setPosition] = useState({ x: -20, y: 40 });
  const open = setOpenId;
  const close = () => setOpenId('');

  return (
    <MenuContext.Provider
      value={{ openId, open, close, position, setPosition }}
    >
      <div>{children}</div>
    </MenuContext.Provider>
  );
}

/**
 * @param {Object} props
 * @param {String} props.menuId unique menu instance name that is the same as that supplied to the Menus.List that is associated with this toggle button
 * @param {String} props.label text label that can be displayed next to the toggle icon
 * @returns
 * @memberof Menus
 *  A compound pattern context menu system
 * If multiple menus are available then wrap the entire section in this Menus component as this acts as the context provider for the system
 */
function Toggle({ menuId, label = '' }) {
  const { openId, open, close, setPosition } = useContext(MenuContext);

  //Just to control a little outline being present whilst the menu is open
  const focusRef = useRef(null);
  function handleClose() {
    // console.log(`close`);
    close();
    focusRef.current?.blur();
  }

  function handleOpen() {
    const position = focusRef.current.getBoundingClientRect();
    // console.log(position);
    setPosition((curr) => {
      return { x: position.width, y: position.height / 2 };
    });
    // console.log(`open: ${menuId}`);
    open(menuId);
  }

  function handleToggle(e) {
    e.stopPropagation();
    openId === menuId ? handleClose() : handleOpen();
  }

  return (
    <StyledToggle onClick={handleToggle} ref={focusRef}>
      <div>{label}</div>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

/**
 * This is essentially the actual context menu itself
 * @param {Object} props
 * @param {Component} props.children  automatically generated children prop which will contain the Menus.Button components that make up the menu itself
 * @param {String} props.menuId the unique name of this menu that correlates to the associated Toggle menuId
 * @param {String} props.direction Optional flex direction of the menu - row (default) | column
 * @returns
 * @memberof Menus
 */
function List({ menuId, children, direction = 'row' }) {
  const { openId, position, close } = useContext(MenuContext);
  const outsideClickRef = useClickOutside(close, false);
  if (openId !== menuId) return null;
  return (
    <StyledList position={position} ref={outsideClickRef} direction={direction}>
      {children}
    </StyledList>
  );
}

/**
 *
 * @param {Object} props
 * @param {Component} props.children automatically generated children prop which will be placed into a div that closes the menu along with the other behaviour associated with the component passed in
 * @returns
 * @memberof Menus
 */
function Button({ children }) {
  const { close } = useContext(MenuContext);
  return (
    <div style={{ width: '100%' }} onClick={() => close()}>
      {children}
    </div>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
