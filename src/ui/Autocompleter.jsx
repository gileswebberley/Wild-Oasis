import { forwardRef, useEffect, useRef, useState } from 'react';
import Input from './Input';
import styled from 'styled-components';
import { useClickOutside } from '../hooks/useClickOutside';
import { useAutocompleter } from '../hooks/useAutocompleter';
import { useListLooper } from '../hooks/useListLooper';

//this ensures that the options box scrolls with the input
const Container = styled.span`
  position: relative;
  min-width: 17rem;
`;

const OptionBox = styled.span`
  position: absolute;
  z-index: 10;
  width: fit-content;
  background-color: var(--color-brand-50);
  box-shadow: var(--shadow-lg);
  border-radius: var(--border-radius-md);
  left: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const OptionList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.8rem;
  padding: 1.2rem;
`;

const Option = styled.button`
  padding: 0.2rem 1.2rem;
  border: none;
  width: 100%;
  background-color: var(--color-brand-100);
  color: var(--color-brand-800);
  &:focus {
    background-color: var(--color-brand-800);
    color: var(--color-brand-50);
  }
  &:hover {
    background-color: var(--color-brand-200);
  }
`;

//data is an array of objects with a completer field eg [{name, other_data}] might use 'name' as the autocomplete field (this is what is displayed and compared to)
//options_length - number of filtered results that will be shown in the options
//setindex - callback function that passes the index of the selected item back to it's parent
//
const Autocompleter = forwardRef(function Autocompleter(
  { data, completer_field, options_length = 5, setindex = null, ...props },
  ref
) {
  const {
    state: { inputValue, filteredItems, activeItem, displayItems },
    clearFiltered,
    setInput,
    clearInput,
    handleSelect,
  } = useAutocompleter(data, completer_field);

  //for positioning options under the input field
  const positionRef = useRef(null);
  const [position, setPosition] = useState({ x: 10, y: 30 });

  //get the position of our input field so we can place the drop-down list below it
  useEffect(() => {
    if (!positionRef.current) {
      return;
    }
    const posBox = positionRef?.current?.getBoundingClientRect();
    setPosition({ x: 0, y: posBox?.height + 5 });
  }, [positionRef]);

  //using our hook from earlier to clear the options list
  const clickOutsideRef = useClickOutside(() => clearFiltered());

  const { containerRef, inputFieldRef, optionBoxRef } = useListLooper();

  //keep the parent synced to the active item (data array index)
  useEffect(() => {
    setindex?.(activeItem);
  }, [activeItem, setindex]);

  //again for use in react-hook-form! This is to keep the rhf value and local inputValue in sync when rhf reset() is called
  useEffect(() => {
    if (Object.hasOwn(props, 'value')) {
      //we're being passed a value, probably from RHF, has it been reset?
      if (props.value === undefined && inputValue !== '') {
        clearInput();
        console.log(`clear on reset`);
      }
    }
  }, [props, inputValue, clearInput]);

  //I was trying to get a datalist alternative working hence the useCallback
  function onSelect(e) {
    const value = handleSelect(e);
    //keep it synced if used in RHF
    props?.onChange?.(value);
  }

  return (
    // The ternary operator in the ref initialisation is the technique to allow the ref to be forwarded (hence the forwardRef declaration of this component) from a react-hook-form but also shared with a local one (in this case positionRef). Also worth noting that the props are spread at the beginning so that the onChange can be over-written in they are coming from a RHF.
    <Container ref={containerRef}>
      <Input
        {...props}
        placeholder="select an option"
        ref={
          ref
            ? (e) => {
                ref(e);
                positionRef.current = e;
                inputFieldRef.current = e;
              }
            : positionRef
        }
        value={inputValue}
        autoComplete="new"
        onChange={(e) => {
          props?.onChange?.(e.target.value);
          setInput(e.target.value);
        }}
        list="options"
      />

      {filteredItems.length > 0 && displayItems && (
        <OptionBox
          position={position}
          ref={(el) => {
            optionBoxRef.current = el;
            clickOutsideRef.current = el;
          }}
        >
          <OptionList id="options">
            {filteredItems
              .map((item, i) => {
                return (
                  <li key={i}>
                    <Option onClick={onSelect} value={item}>
                      {item}
                    </Option>
                  </li>
                );
              })
              .splice(0, options_length)}
          </OptionList>
        </OptionBox>
      )}
    </Container>
  );
});

export default Autocompleter;
