import Button from '../../ui/Button';
import { useUserUpdate } from './useUserUpdate';
import ButtonGroup from '../../ui/ButtonGroup';
import CompoundRegisteredForm from '../../ui/CompoundRegisteredForm';
import toast from 'react-hot-toast';
import styled, { css } from 'styled-components';
import SimpleFormRow from '../../ui/SimpleFormRow';
import FormRow from '../../ui/FormRow';

const FormContainer = styled.div`
  ${(props) =>
    props.type !== 'modal' &&
    css`
      padding: 2.4rem 4rem;

      /* Box */
      background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-100);
      border-radius: var(--border-radius-md);
    `}

  ${(props) =>
    props.type === 'modal' &&
    css`
      max-width: 80rem;
    `}
    
  overflow: hidden;
  font-size: 1.4rem;
`;

function UpdatePasswordForm() {
  const { updateUserPassword, isUpdatingUserPassword: isUpdating } =
    useUserUpdate();

  function onSubmit({ password }) {
    updateUserPassword({ password });
  }

  function onError(errors) {
    toast.error(
      `Please ensure that you have correctly filled out your password change form correctly`
    );
  }

  return (
    <FormContainer>
      <CompoundRegisteredForm
        submitFn={onSubmit}
        errorFn={onError}
        resetOnSubmit={true}
        isLoading={isUpdating}
      >
        <CompoundRegisteredForm.Password
          elementID="password"
          labelStr="New Password (min 6 chars)"
          validationObj={{
            required: 'This field is required',
            minLength: {
              value: 6,
              message: 'Password needs a minimum of 6 characters',
            },
          }}
        />
        <CompoundRegisteredForm.Password
          elementID="passwordConfirtm"
          labelStr="Confirm new password"
          validationObj={{
            required: 'This field is required',
            validate: (value, fieldValues) => {
              return (
                fieldValues.password === value ||
                'Oops, this appears to be different from your password'
              );
            },
          }}
        />
        <FormRow>
          <ButtonGroup justify="end">
            <CompoundRegisteredForm.Reset>
              <Button variation="secondary" disabled={isUpdating}>
                Reset
              </Button>
            </CompoundRegisteredForm.Reset>
            <Button disabled={isUpdating}>Update Password</Button>
          </ButtonGroup>
        </FormRow>
      </CompoundRegisteredForm>
    </FormContainer>
  );
}

export default UpdatePasswordForm;
