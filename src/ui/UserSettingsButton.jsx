import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { HiOutlineUser } from 'react-icons/hi2';

function UserSettingsButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate('../account')}
      size="small"
      variation="secondary"
    >
      <HiOutlineUser /> Account
    </Button>
  );
}

export default UserSettingsButton;
