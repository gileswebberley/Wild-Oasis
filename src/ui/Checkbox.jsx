import styled from 'styled-components';

const StyledCheckbox = styled.div`
  display: flex;
  gap: 1.6rem;

  & input[type='checkbox'] {
    height: 1.6rem;
    width: 1.6rem;
    outline: none;
    transform-origin: 0;
    accent-color: var(--color-brand-600);
    transform: translateY(0.25rem);
  }

  & input[type='checkbox']:focus {
    outline: 1px dotted var(--color-brand-100);
    outline-offset: 1px;
  }

  & input[type='checkbox']:disabled {
    accent-color: var(--color-brand-600);
  }

  & label {
    flex: 1;

    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
`;

function Checkbox({ checked, onChange, disabled = false, id, children }) {
  return (
    <StyledCheckbox>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label htmlFor={!disabled ? id : ''}>{children}</label>
    </StyledCheckbox>
  );
}

export default Checkbox;
