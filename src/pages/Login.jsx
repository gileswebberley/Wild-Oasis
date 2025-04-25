import styled from 'styled-components';
import LoginForm from '../features/authentication/LoginForm';
import Logo from '../ui/Logo';
import Heading from '../ui/Heading';

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

function Login() {
  return (
    <LoginLayout>
      <Logo />
      <Heading as="h1" style={{ textAlign: 'center' }}>
        Admin Login
      </Heading>
      <Heading as="h3" style={{ textAlign: 'center' }}>
        Registered Users Please Enter Your Details
      </Heading>
      <Heading as="h4" style={{ textAlign: 'center' }}>
        <aside>
          <i>For demo purposes you can use giles@example.com with pass9487</i>
        </aside>
      </Heading>
      <LoginForm />
    </LoginLayout>
  );
}

export default Login;
