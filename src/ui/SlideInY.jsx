import { useInView } from 'react-intersection-observer';
import styled, { css } from 'styled-components';

//let's add a little bit of character to the component with a randomised duration
// const rDuration = Math.random() * 2 + 1;//No this creates one value used by all so I've moved the randomisation into the declaration itself

const SlideInYTransition = styled.div`
  --transition-time: ${() => Math.random() * 2 + 1 + 's'};
  --animation-time: calc(var(--transition-time) / 1.5);
  opacity: 0;
  /* min-height: 0 is to fix a firefox quirk where the cabins were scrolling off the top of the page */
  min-height: 0;
  max-width: fit-content;
  justify-content: center;
  transition: opacity var(--transition-time) ease-out;
  ${(props) =>
    props.$inView &&
    css`
      opacity: 1;
    `};

  @keyframes slide-in {
    0% {
      transform: translateY(110dvh);
    }
    100% {
      transform: translateY(0);
    }
  }

  animation: ${(props) =>
    props.$inView ? css`slide-in var(--animation-time) ease-out` : ''};
`;

// var slideInDiv = document.querySelector(SlideInY);
// slideInDiv.style.setProperty('--transition-time', rDuration);

function SlideInY({ children }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  // console.log(inView);
  return (
    <SlideInYTransition $inView={inView} ref={ref}>
      {children}
    </SlideInYTransition>
  );
}
export default SlideInY;
