import styled from 'styled-components';
import Heading from './Heading';
import GlobalStyles from '../styles/GlobalStyles';
import Button from './Button';

const StyledErrorFallback = styled.main`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.8rem;
`;

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 4.8rem;
  flex: 0 1 96rem;
  text-align: center;

  & h2 {
    margin-bottom: 1.6rem;
  }

  & p {
    font-family: 'Courier';
    margin-bottom: 3.2rem;
    color: var(--color-grey-500);
  }
`;

//for use with the react-error-boundary package which automagically sends through the error prop. We have also defined a callback function in our ErrorBoundary so that will be passed through as the resetErrorBoundary prop
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    // We are now outside of our App (because an error has occurred which brought us to this page) so we need to import those global styles like we did for App
    <>
      <GlobalStyles />
      <StyledErrorFallback>
        <Box>
          <Heading as="h2">
            We&apos;re very sorry but something has gone wrong
          </Heading>
          <p>{error.message}</p>
          <Button
            style={{ width: 'fit-content', justifySelf: 'center' }}
            onClick={resetErrorBoundary}
          >
            Return to Home
          </Button>
        </Box>
      </StyledErrorFallback>
    </>
  );
}

export default ErrorFallback;
