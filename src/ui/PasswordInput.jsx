import styled from 'styled-components';
import { forwardRef, useRef, useState } from 'react';
import Input from './Input';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';

//visibility icon holder
const Icon = styled.span`
  position: absolute;
  z-index: 10;
  transform: translate(-2.6rem, 0.8rem);
  cursor: pointer;
  & svg {
    width: 2.2rem;
    height: 2.2rem;
    color: var(--color-brand-600);
  }
`;
const InputHolder = styled.div`
  position: relative;
  width: 100%;
`;
//After a hell of a lot of head scratching it became apparent that I had to use forwardRef for this component if I wanted to be able to use it within a react-hook-form. It appears to be working as I am now getting the validation and error messages. React 19 says it is deprecating it but it seems that this will be automagically converted to accept the ref as a prop
//For use with react-hook-forms simply treat it as any other input (ie pass through {...register(name, options)}) however for use as a controlled element make sure you include the prop ref={null}
const PasswordInput = forwardRef(function PasswordInput(inputProps, ref) {
  const [isVisible, setIsVisible] = useState(false);
  //when using an onChange handler to set the state in the parent we are losing focus so have had to put this functionality in here, originally it was designed for use with react-hook-form
  const focusRef = useRef(null);

  return (
    <InputHolder>
      <Input
        type={isVisible ? 'text' : 'password'}
        //for auto-complete functionality
        {...inputProps}
        ref={
          ref
            ? (e) => {
                ref(e);
                focusRef.current = e;
              }
            : focusRef
        }
      ></Input>
      <Icon
        onClick={(e) => {
          e.preventDefault();
          setIsVisible((vis) => !vis);
          focusRef?.current?.focus();
        }}
      >
        {isVisible ? <HiEyeSlash /> : <HiEye />}
      </Icon>
    </InputHolder>
  );
});

export default PasswordInput;
