import { createContext, useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import SimpleFormRow from './SimpleFormRow';
import Input from './Input';
import Textarea from './Textarea';
import PasswordInput from './PasswordInput';
import { Flag } from './Flag';
import Autocompleter from './Autocompleter';
import FormRow from './FormRow';

const StyledCountryInput = styled.div`
  display: flex;
  gap: 2rem;
`;

const CountryFlag = styled(Flag)`
  max-width: 5rem;
  font-size: 1rem;
`;

//basic styled components
const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.div`
  display: inline;
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

//Trying to make this a compound component now that I know about the pattern
const registeredFormContext = createContext();

//All input types require a styled component called SimpleFormRow
function CompoundRegisteredForm({
  children,
  submitFn,
  errorFn,
  isLoading = null,
  defaultValues = {},
  resetOnSubmit = true,
}) {
  //React-hook-form usage setup -------------------
  //control is for creating controlled components (like the country selector)
  //mode overrides the default validation behaviour of the browser (I decided when a field loses focus is the perfect time to show the validation messages as onChange produces a lot of re-renders)
  //reValidateMode is set to onChange by default which seems bad to me considering the comment above, so I've changed it to blur
  //resetOptions is used to clear error messages when the form is reset
  const { register, handleSubmit, reset, formState, control } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resetOptions: { keepErrors: false },
    defaultValues: defaultValues,
  });
  const { errors, isSubmitSuccessful } = formState;
  //if no loading state is supplied as a prop then we will use the form's isLoading prop
  isLoading = !isLoading ? formState.isLoading : isLoading;

  //reset the form after a successful submission
  useEffect(() => {
    if (resetOnSubmit && isSubmitSuccessful) reset();
  }, [resetOnSubmit, isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit(submitFn, errorFn)}>
      <registeredFormContext.Provider
        value={{ isLoading, errors, register, reset, control }}
      >
        {children}
      </registeredFormContext.Provider>
    </form>
  );
}

//a wrapper for the form's reset button so it fires the react-hook-form reset rather than just the browser's default behaviour
function ResetButton({ children }) {
  const { reset } = useContext(registeredFormContext);
  return (
    <span
      onClick={(e) => {
        //in case there's a button as the child we don't want it to submit the form
        e.preventDefault();
        reset();
      }}
    >
      {children}
    </span>
  );
}

function RegisteredInput({
  elementID,
  labelStr,
  validationObj,
  type = 'text',
}) {
  //grab the general form variables from our context
  const { isLoading, errors, register } = useContext(registeredFormContext);

  //check that this is not being used incorrectly and safely pass on to the correct component if so
  if (type === 'textarea') {
    return <RegisteredTextarea {...{ elementID, labelStr, validationObj }} />;
  }
  if (type === 'email') {
    return <RegisteredEmailInput {...{ elementID, labelStr, validationObj }} />;
  }
  if (type === 'password') {
    return (
      <RegisteredPasswordInput {...{ elementID, labelStr, validationObj }} />
    );
  }

  return (
    <SimpleFormRow>
      <Label htmlFor={elementID}>{labelStr}</Label>
      <Input
        disabled={isLoading}
        type={type}
        id={elementID}
        {...register(elementID, validationObj)}
      />
      {errors?.[elementID]?.message && (
        <Error>{errors[elementID].message}</Error>
      )}
    </SimpleFormRow>
  );
}

function RegisteredTextarea({ elementID, labelStr, validationObj }) {
  //grab the general form variables from our context
  const { isLoading, errors, register } = useContext(registeredFormContext);

  return (
    <SimpleFormRow>
      <Label htmlFor={elementID}>{labelStr}</Label>
      <Textarea
        disabled={isLoading}
        type="text"
        id={elementID}
        {...register(elementID, validationObj)}
      />
      {errors?.[elementID]?.message && (
        <Error>{errors[elementID].message}</Error>
      )}
    </SimpleFormRow>
  );
}

//contains the pattern checking for a valid email address and autoComplete functionality
function RegisteredEmailInput({ elementID, labelStr, validationObj }) {
  //grab the general form variables from our context
  const { isLoading, errors, register } = useContext(registeredFormContext);

  return (
    <SimpleFormRow>
      <Label htmlFor={elementID}>{labelStr}</Label>
      <Input
        disabled={isLoading}
        type="email"
        //for auto-complete functionality
        autoComplete="username"
        id={elementID}
        {...register(elementID, {
          ...validationObj,
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Your email appears to be invalid',
          },
        })}
      />
      {errors?.[elementID]?.message && (
        <Error>{errors[elementID].message}</Error>
      )}
    </SimpleFormRow>
  );
}

function RegisteredPasswordInput({ elementID, labelStr, validationObj }) {
  //grab the general form variables from our context
  const { isLoading, errors, register } = useContext(registeredFormContext);

  return (
    <SimpleFormRow>
      <Label htmlFor={elementID}>{labelStr}</Label>
      <PasswordInput
        disabled={isLoading}
        id={elementID}
        {...register(elementID, validationObj)}
      />
      {errors?.[elementID]?.message && (
        <Error>{errors[elementID].message}</Error>
      )}
    </SimpleFormRow>
  );
}

function RegisteredCountryInput({
  elementID,
  labelStr,
  validationObj,
  indexEvent,
  data,
}) {
  //grab the general form variables from our context
  const { isLoading, errors, control } = useContext(registeredFormContext);
  const [countryIndex, setCountryIndex] = useState(null);
  let countryObject = data[countryIndex] ?? {};
  // countryIndex !== null ? countries_data[countryIndex] : {};
  let countryFlag = countryIndex
    ? `https://flagcdn.com/${countryObject?.Code?.toLowerCase()}.svg`
    : null;
  let countryName = countryObject?.Name ?? null;

  function handleSettingEvent(e) {
    setCountryIndex((ci) => e);
  }

  //when the country index is set then pass up the name and flag to the parent component
  useEffect(() => {
    indexEvent(countryName, countryFlag);
  }, [countryIndex, countryFlag, countryName, indexEvent]);

  return (
    <FormRow>
      <Label htmlFor={elementID}>{labelStr}</Label>
      <StyledCountryInput>
        <Controller
          control={control}
          rules={validationObj}
          name={elementID}
          render={({ field }) => (
            <Autocompleter
              id={elementID}
              disabled={isLoading}
              data={data}
              setindex={handleSettingEvent}
              completer_field="Name"
              {...field}
            />
          )}
        />
        {countryFlag && (
          <CountryFlag
            src={countryFlag}
            alt={`flag of ${countryObject?.Name}`}
          />
        )}
      </StyledCountryInput>
      {errors?.[elementID]?.message && (
        <Error>{errors[elementID].message}</Error>
      )}
    </FormRow>
  );
}

//TODO - add checkbox and perhaps even select

CompoundRegisteredForm.Input = RegisteredInput;
CompoundRegisteredForm.Textarea = RegisteredTextarea;
CompoundRegisteredForm.Email = RegisteredEmailInput;
CompoundRegisteredForm.Password = RegisteredPasswordInput;
CompoundRegisteredForm.Country = RegisteredCountryInput;
CompoundRegisteredForm.Reset = ResetButton;

export default CompoundRegisteredForm;
