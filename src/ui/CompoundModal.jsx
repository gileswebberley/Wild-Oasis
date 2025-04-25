import { cloneElement, createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';
import styled from 'styled-components';
import { useClickOutside } from '../hooks/useClickOutside';
//This is to create a pop-up style space to place, to start with, our add CreateCabinForm
const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
  /* overflow-y: scroll; */
`;
//This is to blur out the background, ie the page 'behind' this modal window
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;
//A simple close button
const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

//as practise we are going to create a Modal system using the Compound Component pattern
const ModalContext = createContext();

function CompoundModal({ children }) {
  //set the name of the modal window you wish to show, hide by resetting to an empty string
  const [modalName, setModalName] = useState('');
  const openModalByName = setModalName;
  const closeModal = () => setModalName('');

  return (
    <ModalContext.Provider value={{ modalName, openModalByName, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ openName, children }) {
  const { openModalByName } = useContext(ModalContext);
  //don't overuse this method but it's a good way to add props to the children apparently (not sure how it works if we have multiple children? it must be valid JSX, namely within a base component)
  return cloneElement(children, { onClick: () => openModalByName(openName) });
}

//The idea of using the createPortal is to move this outside of the DOM structure so that we can avoid parent elements' visibility styling having an affect
function Modal({ children, contentName }) {
  const { closeModal, modalName } = useContext(ModalContext);
  //use our custom hook to add the click outside of the window close functionality
  const modalRef = useClickOutside(closeModal);

  //check if this is the named modal window that should be open
  if (modalName !== contentName) return null;

  //createPortal takes the returned JSX as it's first argument and where to place it within the DOM as it's second argument
  return createPortal(
    <Overlay>
      <StyledModal ref={modalRef}>
        <Button onClick={closeModal}>
          <HiXMark />
        </Button>
        <div>
          {cloneElement(children, {
            closeMe: closeModal,
            presentationType: 'modal',
          })}
        </div>
      </StyledModal>
    </Overlay>,
    document.getElementById('main')
  );
}

CompoundModal.Open = Open;
CompoundModal.Modal = Modal;

export default CompoundModal;
