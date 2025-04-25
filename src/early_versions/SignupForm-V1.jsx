import { useForm } from 'react-hook-form';
import Button from '../../ui/Button';
import ButtonGroup from '../../ui/ButtonGroup';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import CompoundRegisteredForm from '../../ui/CompoundRegisteredForm';
import toast from 'react-hot-toast';

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
  //we need some validation on a larger form so we'll use react-hook-form
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors, isLoading } = formState;

  function submitNewUser(data) {}

  //errors is the same as our errors object above
  function onError(errors) {
    toast.error('Please check that you have filled out the form correctly');
  }

  return (
    // the noValidate in the Form tag is to stop the automatic browser validation according to input field types
    <Form noValidate onSubmit={handleSubmit(submitNewUser, onError)}>
      {/* <FormRow label="Full name" error={''}>
        <Input type="text" id="fullName" />
      </FormRow>*/}
      <CompoundRegisteredForm
        errors={errors}
        isLoading={isLoading}
        register={register}
      >
        <CompoundRegisteredForm.Input
          type="text"
          elementID="fullName"
          labelStr="Full Name"
          validationObj={{
            required: 'Please provide your name',
          }}
        />

        {/* <FormRow label="Email address" error={''}>
          <Input type="email" id="email" />
        </FormRow> */}
        <CompoundRegisteredForm.Input
          type="email"
          elementID="email"
          labelStr="Email address"
          validationObj={{
            required: 'Please provide your email',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Your email appears to be invalid',
            },
          }}
        />

        {/* <FormRow label="Password (min 8 characters)" error={''}>
          <Input type="password" id="password" />
        </FormRow> */}
        <CompoundRegisteredForm.Input
          type="password"
          elementID="password"
          labelStr="Password (min 8 characters)"
          validationObj={{
            required: 'Please provide your password',
            minLength: {
              value: 8,
              message: 'Password should contain at least 8 characters',
            },
          }}
        />

        {/* <FormRow label="Repeat password" error={''}>
          <Input type="password" id="passwordConfirm" />
        </FormRow> */}
        <CompoundRegisteredForm.Input
          type="password"
          elementID="passwordConfirm"
          labelStr="Repeat password"
          validationObj={{
            required: 'Please confirm your password',
            validate: (value, fieldValues) => {
              return (
                value === fieldValues.password ||
                'This appears to be different from your password'
              );
            },
          }}
        />
      </CompoundRegisteredForm>

      <FormRow>
        {/* type is an HTML attribute! */}
        <ButtonGroup>
          <Button variation="secondary" type="reset">
            Cancel
          </Button>
          <Button>Create new user</Button>
        </ButtonGroup>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
