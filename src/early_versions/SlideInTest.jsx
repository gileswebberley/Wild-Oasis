import styled from 'styled-components';
import SlideInY from '../ui/SlideInY';

const TestSquare = styled.div`
  width: 300px;
  height: 200px;
  margin: 30px;
  background-color: orange;
`;

function SlideInTest() {
  return (
    <div>
      <SlideInY>
        <TestSquare>1</TestSquare>
      </SlideInY>
      <SlideInY>
        <TestSquare>2</TestSquare>
      </SlideInY>
      <SlideInY>
        <TestSquare>3</TestSquare>
      </SlideInY>
      <SlideInY>
        <TestSquare>4</TestSquare>
      </SlideInY>
      <SlideInY>
        <TestSquare>5</TestSquare>
      </SlideInY>
      <SlideInY>
        <TestSquare>6</TestSquare>
      </SlideInY>
      <SlideInY>
        <TestSquare>7</TestSquare>
      </SlideInY>
      <SlideInY>
        <TestSquare>8</TestSquare>
      </SlideInY>
    </div>
  );
}

export default SlideInTest;
