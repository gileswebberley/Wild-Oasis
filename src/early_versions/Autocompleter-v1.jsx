import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Input from '../ui/Input';
import styled from 'styled-components';
import { useClickOutside } from '../hooks/useClickOutside';

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
const Autocompleter = forwardRef(function Autocompleter(
  { data, completer_field, options_length = 5, setindex = null, ...props },
  ref
) {
  //active item will be the index of the selected possibility
  const [activeItem, setActiveItem] = useState(null);
  //the value of the controlled input element
  const [inputValue, setInputValue] = useState('');
  //the array of filtered results after comparing possibles with the input value
  const [filteredItems, setFilteredItems] = useState([]);
  //just a flag for whether the options menu should be rendered
  const [displayItems, setDisplayItems] = useState(false);

  //for positioning options under the input field
  const positionRef = useRef(null);
  const [position, setPosition] = useState({ x: 10, y: 30 });

  //using our hook from earlier to clear the options list
  const clickOutsideRef = useClickOutside(() => setFilteredItems([]));

  //set up the array of completer field from data
  const possibles = useMemo(() => {
    return data.map((item) => item[completer_field]);
  }, [data, completer_field]);

  //I was trying to get a datalist alternative working hence the useCallback
  function handleSelect(e) {
    e.preventDefault?.();
    const value = e.target.value;
    const indexForSelection = possibles.indexOf(value);
    setInputValue(value);
    setFilteredItems([]);
    setDisplayItems(false);
    setActiveItem(indexForSelection);
    //keep it synced if used in RHF
    props?.onChange?.(value);
  }

  //get the position of our input field so we can place the drop-down list below it
  useEffect(() => {
    if (!positionRef.current) {
      return;
    }
    const posBox = positionRef?.current?.getBoundingClientRect();
    setPosition({ x: 0, y: posBox?.height + 5 });
  }, [positionRef]);

  //handle the input changing and create the options
  useEffect(() => {
    //if input is empty or has been deleted reset everything
    if (inputValue.length < 1) {
      setFilteredItems([]);
      setDisplayItems(true);
      setActiveItem(null);
      return;
    } //or an option has been selected but then a char or more has been deleted
    else if (inputValue.length !== possibles[activeItem]?.length) {
      setDisplayItems(true);
      setActiveItem(null);
    } //or if we have already made our selection (ie set displayItems to false) but there are still other options (this is to get rid of longer names that start with the name selected eg united states [minor outlying islands] )
    else if (!displayItems) {
      return;
    }
    //create filtered results array and clear if it is already a complete match
    const validOptions = possibles.filter(
      (name) =>
        name.toLocaleLowerCase().startsWith(inputValue.toLocaleLowerCase()) &&
        name.toLocaleLowerCase() !== inputValue.toLocaleLowerCase()
    );
    if (validOptions.length < 1) {
      setFilteredItems([]);
      setDisplayItems(false);
      return;
    }
    setDisplayItems(true);
    setFilteredItems(validOptions);
  }, [inputValue, possibles, displayItems, activeItem]);

  //keep the parent synced to the active item (data array index)
  useEffect(() => {
    setindex?.(activeItem);
  }, [activeItem, setindex]);

  //again for use in react-hook-form! This is to keep the rhf value and local inputValue in sync when rhf reset() is called
  useEffect(() => {
    if (Object.hasOwn(props, 'value')) {
      console.table(props);
      //we're being passed a value, probably from RHF
      if (props.value === undefined) {
        setInputValue('');
        console.log(`useEfect change to inputValue`);
      }
    }
  }, [props]);

  return (
    // The ternary operator in the ref declaration is the technique to allow the ref to be forwarded (hence the forwardRef declaration of this component) from a react-hook-form but also shared with a local one (in this case positionRef). Also worth noting that the props are spread at the beginning so that the onChange can be over-written in they are coming from a RHF.
    <Container>
      <Input
        {...props}
        placeholder="select an option"
        ref={
          ref
            ? (e) => {
                ref(e);
                positionRef.current = e;
              }
            : positionRef
        }
        value={
          inputValue
          // !Object.hasOwn(props, 'value')
          //   ? inputValue
          //   : props.value === undefined
          //   ? ''
          //   : inputValue
        }
        autoComplete="new"
        onChange={(e) => {
          props?.onChange?.(e.target.value);
          setInputValue(e.target.value);
        }}
      />

      {filteredItems.length > 0 && displayItems && (
        <OptionBox position={position} ref={clickOutsideRef}>
          <OptionList>
            {filteredItems
              .map((item, i) => {
                return (
                  <li key={i}>
                    <Option onClick={handleSelect} value={item}>
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
