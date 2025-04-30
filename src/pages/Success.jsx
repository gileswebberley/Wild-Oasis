import { useNavigate } from 'react-router-dom';
import { useIndexedDB } from '../hooks/useIndexedDB';
import Button from '../ui/Button';
import ButtonGroup from '../ui/ButtonGroup';
import CabinSketchHeading from '../ui/CabinSketchHeading';
import GuestContainer from '../ui/GuestContainer';
import SlideInY from '../ui/SlideInY';
import { useLogout } from '../features/authentication/useLogout';
import { iDB } from '../utils/shared_constants';
import { HiClipboardCopy } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useUser } from '../features/authentication/useUser';
import { useEffect } from 'react';

const noHarvestEmail = 'gileswebberley@gmail.com';
const noHarvestSubject = encodeURI('Message from the Wild Oasis Demo site');

function Success() {
  const { isCheckingUser, user, isAuthenticated, isAnonymous } = useUser();
  const { deleteDatabase } = useIndexedDB(iDB.name);

  const navigate = useNavigate();
  const { logout } = useLogout();

  //if not authenticated user redirect
  useEffect(() => {
    if (!isAuthenticated && !isAnonymous && !isCheckingUser) {
      toast.error(
        `You shouldn't be on this page, it's for authenticated users when their fake payment has been successful`
      );
      navigate('../');
    }
  }, [isAuthenticated, isCheckingUser, navigate, isAnonymous]);

  function handleFinish(e) {
    e.preventDefault();
    logout(false, {
      onSuccess: () => {
        deleteDatabase(iDB.name).then(() => navigate('../', { replace: true }));
      },
    });
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(noHarvestEmail);
    toast.success(
      'Thanks for copying my email to your clipboard, I look forward to hearing from you'
    );
  }
  return (
    <SlideInY>
      <GuestContainer>
        <CabinSketchHeading as="h1">
          Thank you for your booking, we'll see you here!
        </CabinSketchHeading>
        <CabinSketchHeading as="h4">
          That's it for now, I am learning still and so will update this page
          and the process further over the coming days/weeks. If you'd like to
          delete the booking data that we've stored on your system and log out
          then please click the link below. <br />I would really love to get
          some real world experience, as I haven't been involved in web
          development since the early noughties, so if you can help me out
          please do pop me an email at{' '}
          <a
            href={`mailto:${noHarvestEmail}?subject=${noHarvestSubject}`}
            target="_blank"
            rel="noreferrer"
          >
            {noHarvestEmail}
          </a>
          <span title="Click to copy my email address to your clipboard">
            <HiClipboardCopy onPointerDown={copyToClipboard} /> I would really
          </span>
          appreciate it.
          <br />
          T'ta for now.
        </CabinSketchHeading>
        <ButtonGroup>
          <Button onClick={handleFinish}>Tidy Up</Button>
        </ButtonGroup>
      </GuestContainer>
    </SlideInY>
  );
}

export default Success;
