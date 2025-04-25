import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';
import { HiKey } from 'react-icons/hi2';
import ButtonGroup from '../../ui/ButtonGroup';

function Login({ guest = false }) {
  const navigate = useNavigate();
  return (
    <ButtonGroup>
      <Button
        size="small"
        variation="secondary"
        onClick={() => navigate('../login')}
        $guest={guest}
      >
        <HiKey />
      </Button>
    </ButtonGroup>
  );
}

export default Login;
