import { useState } from 'react';

import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

import { useUser } from './useUser';
import ButtonGroup from '../../ui/ButtonGroup';
import { useUserUpdate } from './useUserUpdate';
import styled from 'styled-components';

const EditImage = styled.img`
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  width: 10rem;
`;

const EditImgDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: end;
  min-width: 20rem;
  gap: 1.2rem;
  /* flex-direction: column; */
`;

function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName, avatar: currentAvatar },
    },
  } = useUser();

  // console.log(`User ${currentFullName} with avatar ${currentAvatar}`);

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState(currentAvatar || 'default-user.jpg');
  const [changeAvatar, setChangeAvatar] = useState(false);

  const { updateUser, isUpdatingUser } = useUserUpdate();

  function handleSubmit(e) {
    e.preventDefault();
    //true if changed
    const hasChangedFullName = fullName !== currentFullName && fullName !== '';
    const hasChangedAvatar = avatar !== currentAvatar && avatar;
    if (!hasChangedAvatar && !hasChangedFullName) return;
    let oldAvatar = null;
    if (hasChangedAvatar) {
      oldAvatar = currentAvatar;
    } else {
      setAvatar(() => null);
    }
    if (!hasChangedFullName) {
      setFullName(() => null);
    }
    if (fullName || avatar) {
      updateUser(
        { fullName, avatar, oldAvatar },
        {
          onSuccess: () => {
            handleReset();
          },
        }
      );
    }
  }

  //we want to reset the form to it's initial state which html form reset will not do
  function handleReset() {
    setFullName(currentFullName);
    setAvatar(currentAvatar);
    setChangeAvatar(false);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName || 'Anon'}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
          disabled={isUpdatingUser}
        />
      </FormRow>
      <FormRow label="Avatar image">
        {!changeAvatar ? (
          <EditImgDiv>
            <EditImage src={currentAvatar} alt="Current avatar" />
            <span>
              <Button
                size="small"
                disabled={isUpdatingUser}
                onClick={() => setChangeAvatar(true)}
              >
                Change Image
              </Button>
            </span>
          </EditImgDiv>
        ) : (
          <FileInput
            id="avatar"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            disabled={isUpdatingUser}
          />
        )}
      </FormRow>
      <FormRow label={null}>
        <ButtonGroup justify="end">
          <Button
            type="reset"
            onClick={handleReset}
            variation="secondary"
            disabled={isUpdatingUser}
          >
            Reset
          </Button>
          <Button disabled={isUpdatingUser}>Update account</Button>
        </ButtonGroup>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
