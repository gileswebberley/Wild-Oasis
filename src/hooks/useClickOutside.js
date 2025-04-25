import { useEffect, useRef } from 'react';

/**
 *
 * @param {Function} closeFn The function to be called when a click occurs outside of the DOM element attached to the returned ref
 * @param {Boolean} listenCapturing As events normally 'bubble' up to the document level that our event listener is attached to we default to event 'capture' mode. Set this to false if you wish to implement event bubbling (warning - this would mean that all clicks within the page would execute this event handler)
 * @returns The ref produced by useRef() that we should attach to the DOM element that denotes the 'inside' eg the modal window itself
 * @example //We wish to close when the user clicks outside of the StyledModal (in this case the Overlay covers the entire page btw)
  const modalRef = useClickOutside(closeModal);
  ....
  <Overlay>
      <StyledModal ref={modalRef}>
      ....
      </StyledModal>
    </Overlay>
 */
export function useClickOutside(closeFn, listenCapturing = true) {
  //click outside close functionality - note the way we get a ref to a DOM element by setting it to null and then passing it as a property to the element we want to manipulate
  const ref = useRef(null);
  //now we add a vanilla event listener
  useEffect(
    function () {
      //define our on click handler
      function handleOutsideClick(e) {
        if (ref.current && !ref.current?.contains(e.target)) {
          closeFn();
        }
      }
      //notice we set the eventPhase to 'capturing' rather than 'bubbling' so that this event is not triggered by all other clicks (the various buttons) as it would by default
      document.addEventListener('click', handleOutsideClick, listenCapturing);
      //remembering to clear up the listener in the 'clean-up function'
      return () =>
        document.removeEventListener(
          'click',
          handleOutsideClick,
          listenCapturing
        );
    },
    [closeFn, listenCapturing]
  );

  return ref;
}
