import styled from 'styled-components';
import GlobalStyles from '../styles/GlobalStyles';
import Button from '../ui/Button';
import Row from '../ui/Row';

const StyledApp = styled.main`
  margin: 10px;
`;

function App() {
  //We are using styled components global styles for the first time, here we make our GlobalStyles component a sibling of our App
  return (
    <>
      <GlobalStyles />
      <StyledApp>
        <Row type="vertical">
          App
          {/* see the Button component for intro to using props to make them more reusable and flexible */}
          <Button size="small" variation="danger">
            temp button
          </Button>
        </Row>
      </StyledApp>
    </>
  );
}

export default App;
