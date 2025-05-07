import styled from 'styled-components';
import Button from './Button';
import Heading from './Heading';

const StyledConfirmDelete = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

//closeMe is attached by the CompoundModal component as it clones it's child element (which is this)
function ConfirmDelete({ resourceName, onConfirm, disabled, closeMe }) {
  return (
    <StyledConfirmDelete>
      <Heading as="h3">Delete {resourceName}</Heading>
      <p>
        Are you sure you want to delete this {resourceName} permanently? This
        action cannot be undone. For demo purposes this action is disabled,
        please click cancel.
      </p>

      <div>
        <Button variation="secondary" disabled={disabled} onClick={closeMe}>
          Cancel
        </Button>
        <Button variation="danger" disabled={true} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

export default ConfirmDelete;
