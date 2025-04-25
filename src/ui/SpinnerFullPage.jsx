import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;

const FPContainer = styled.div`
  position: fixed;
  align-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--color-grey-0);
`;
const SpinnerFP = styled.div`
  margin: auto;
  overflow-x: hidden;
  height: 50svh;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(farthest-side, var(--color-grey-400) 100%, #0000)
      top/0px 50px no-repeat,
    conic-gradient(#0000 5%, var(--color-grey-400));
  -webkit-mask: radial-gradient(
    farthest-side,
    #0000 calc(100% - 80px),
    #ffffff 0
  );
  animation: ${rotate} 1.3s infinite linear;
`;
function SpinnerFullPage() {
  return (
    <FPContainer>
      <SpinnerFP />
    </FPContainer>
  );
}
export default SpinnerFullPage;
