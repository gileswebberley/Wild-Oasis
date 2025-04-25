import Button from '../../ui/Button';
import CreateCabinForm from './CreateCabinForm';
import CompoundModal from '../../ui/CompoundModal';
import ButtonGroup from '../../ui/ButtonGroup';
import SimpleFormRow from '../../ui/SimpleFormRow';

function AddCabinModal() {
  return (
    <div>
      <CompoundModal>
        <SimpleFormRow>
          <ButtonGroup>
            <CompoundModal.Open openName="add-cabin">
              {/* onClick prop is added to the button with cloneElement inside CompoundModal
          and the nav is just for styling so it doesn't spread across the page
          <nav style={{ width: 'fit-content' }}> */}
              <Button>Add New Cabin</Button>
              {/* </nav> */}
            </CompoundModal.Open>
          </ButtonGroup>
        </SimpleFormRow>
        <CompoundModal.Modal contentName="add-cabin">
          {/* closeMe and presentationType props are added to the form with cloneElement inside CompoundModal */}
          <CreateCabinForm />
        </CompoundModal.Modal>
      </CompoundModal>
    </div>
  );
}

export default AddCabinModal;
