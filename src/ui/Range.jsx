import styled from 'styled-components';

const StyledRange = styled.span`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  /* Add the counter display */
  & span {
    width: 5%;
    text-align: center;
  }
  & input[type='range'] {
    /* clear the browser defaults */
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
    width: 100%;
    /* get rid of the white box around the ends of the track */
    background-color: inherit;
  }
  /* Style the track... */
  /* ::webkit is for Chrome, Safari, Opera, and Edge Chromium */
  & input[type='range']::-webkit-slider-runnable-track {
    background-color: var(--color-brand-600);
    height: 1rem;
    border-radius: 1rem;
  }

  /* ::moz is for Firefox */
  & input[type='range']::-moz-range-track {
    background-color: var(--color-brand-600);
    height: 1rem;
    border-radius: 1rem;
  }

  /* Style the thumb... */
  & input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1.4rem;
    height: 1.4rem;
    /* fix the thumb not being centred on the track ((track-height/2)-(thumb-height/2)) */
    margin-top: -0.2rem;
    border-radius: 50%;
    border: 1px solid var(--color-brand-900);
    background-color: var(--color-brand-100);
  }

  & input[type='range']::-moz-range-thumb {
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 50%;
    border: 1px solid var(--color-brand-900);
    background-color: var(--color-brand-100);
  }

  /* Take care of the focus behaviour */
  & input[type='range']:focus {
    outline: none;
  }

  & input[type='range']:focus::-webkit-slider-thumb {
    outline: 2px dotted var(--color-brand-100);
  }
  & input[type='range']:focus::-moz-range-thumb {
    outline: 2px dotted var(--color-brand-100);
  }
`;

function Range({ value, min, max, onChange, id, disabled = false }) {
  return (
    <StyledRange>
      <input
        type="range"
        step="1"
        id={id}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <span>{value}</span>
    </StyledRange>
  );
}

export default Range;
