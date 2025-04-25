import styled, { css } from 'styled-components';
import { useUser } from './useUser';
import SpinnerMini from '../../ui/SpinnerMini';
import { getDisplayName } from '../../utils/helpers';

//$guest prop introduced to re-use components in the guest site as they were a bit ugly with the standard colours
const StyledUserAvatar = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
  ${(props) =>
    props.$guest &&
    css`
      color: var(--color-yellow-700);
    `}
`;

const Avatar = styled.img`
  width: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-600);
  margin-left: -2.1rem;
  ${(props) =>
    props.$guest &&
    css`
      background-color: var(--color-yellow-100);
      color: var(--color-yellow-700);
    `}
`;

const NameBox = styled.span`
  background-color: var(--color-grey-100);
  padding: 0.4rem 2.8rem 0.4rem 1.4rem;
  border-radius: 10rem;
  ${(props) =>
    props.$guest &&
    css`
      background-color: var(--color-yellow-100);
      color: var(--color-yellow-700);
    `}
`;

export default function UserAvatar({ guest = false }) {
  const { user, isCheckingUser } = useUser();
  const { fullName, avatar } = user?.user_metadata ?? {};
  const displayName = getDisplayName(fullName);

  return (
    <>
      {isCheckingUser ? (
        <SpinnerMini />
      ) : (
        <StyledUserAvatar $guest={guest}>
          <NameBox $guest={guest}>{displayName || 'Anon'}</NameBox>
          <Avatar
            $guest={guest}
            src={avatar || 'default-user.jpg'}
            alt={`Avatar for ${fullName}`}
          />
        </StyledUserAvatar>
      )}
    </>
  );
}
