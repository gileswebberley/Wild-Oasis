import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';
import ButtonGroup from '../../ui/ButtonGroup';
import { HiArrowRightEndOnRectangle } from 'react-icons/hi2';

function GuestLogin() {
  const navigate = useNavigate();
  return (
    <ButtonGroup justify="end">
      <Button
        size="small"
        variation="secondary"
        $guest={true}
        onClick={() => navigate('../guest')}
      >
        <HiArrowRightEndOnRectangle />
        Sign-In
      </Button>
    </ButtonGroup>
  );
}

export default GuestLogin;
