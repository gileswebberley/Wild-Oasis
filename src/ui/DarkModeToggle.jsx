import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';
import Button from './Button';
import ButtonGroup from './ButtonGroup';
import { useDarkMode } from '../context/DarkModeContext';
import { useRef } from 'react';

function DarkModeToggle({ guest = false }) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const focusRef = useRef(null);

  function handleClick() {
    toggleDarkMode();
    if (focusRef.current) {
      focusRef.current.blur();
    }
  }

  return (
    <ButtonGroup>
      <Button
        ref={focusRef}
        onClick={handleClick}
        size="small"
        variation="secondary"
        $guest={guest}
      >
        {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
      </Button>
    </ButtonGroup>
  );
}

export default DarkModeToggle;
