import styled from 'styled-components';
import { useState } from 'react';
import { useCreateEditCabin } from '../features/cabins/useCreateEditCabin';
import { useDeleteCabin } from '../features/cabins/useDeleteCabin';
import { formatCurrency } from '../utils/helpers';

import Button from '../ui/Button';
import CreateCabinForm from '../features/cabins/CreateCabinForm';
import SpinnerTiny from '../ui/SpinnerTiny';
import { HiPencil, HiSquare2Stack, HiTrash } from 'react-icons/hi2';
import { HiArrowCircleUp } from 'react-icons/hi';
import toast from 'react-hot-toast';

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr minmax(10rem, 1fr);
  column-gap: 2.4rem;
  align-items: center;
  padding: 1.4rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const Img = styled.img`
  display: block;
  width: 100%;
  /* height: 100%; */
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Price = styled.div`
  font-family: 'Sono';
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
`;

const ButtonBox = styled.div`
  display: flex;
  /* flex-direction: column; */
  gap: 0.2rem;
`;

const ConfirmToast = styled.div`
  background-color: var(--color-red-800);
  color: var(--color-grey-50);
  font-size: 16px;
  text-align: center;
  border-radius: 20px;
  max-width: 400px;
  padding: 16px 24px;
`;

const ConfirmButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-top: 20px;
`;
//This contains the toast custom confirm
function CabinRow({ cabin }) {
  const [showForm, setShowForm] = useState(false);
  //extracted the deletion to a custom hook because it uses a couple of hooks
  const { isDeleting, deleteCabinMutate } = useDeleteCabin();
  const { isBusy, createEditMutate } = useCreateEditCabin();
  const isDisabled = isDeleting || isBusy;

  const {
    id,
    name,
    imageUrl,
    maxCapacity,
    regularPrice,
    discount,
    description,
  } = cabin;

  function handleDuplicateCabin() {
    createEditMutate({
      name: `Copy of ${name}`,
      maxCapacity,
      regularPrice,
      discount,
      description,
      imageUrl,
    });
  }

  function handleDeleteCabin(id) {
    toast.custom((t) => (
      <ConfirmToast>
        Are you sure you want to delete this cabin, this action cannot be
        undone?
        <ConfirmButtons>
          <Button
            size="medium"
            variation="primary"
            onClick={() => {
              deleteCabinMutate(id);
              toast.dismiss(t.id);
            }}
          >
            Yes
          </Button>
          <Button
            size="medium"
            variation="primary"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </Button>
        </ConfirmButtons>
      </ConfirmToast>
    ));
  }

  return (
    <>
      <TableRow role="row">
        <Img src={imageUrl} alt="Image of this cabin" />
        <Cabin>{name}</Cabin>
        <div>Fits upto {maxCapacity} guests</div>
        <Price>{formatCurrency(regularPrice)}</Price>
        <Discount>{discount ? formatCurrency(discount) : 'n/a'}</Discount>
        <ButtonBox>
          <Button
            size="small"
            variation="primary"
            onClick={() => setShowForm((show) => !show)}
            disabled={isDisabled}
          >
            {showForm ? <HiArrowCircleUp /> : <HiPencil />}
          </Button>
          <Button
            size="small"
            variation="primary"
            onClick={() => handleDuplicateCabin()}
            disabled={isDisabled}
          >
            {isBusy ? <SpinnerTiny /> : <HiSquare2Stack />}
          </Button>
          <Button
            size="small"
            variation="danger"
            onClick={() => handleDeleteCabin(id)}
            disabled={isDisabled}
          >
            {isDeleting ? <SpinnerTiny /> : <HiTrash />}
          </Button>
        </ButtonBox>
      </TableRow>
      {showForm && (
        <CreateCabinForm
          closeMe={() => setShowForm(false)}
          cabinToEdit={cabin}
        />
      )}
    </>
  );
}

export default CabinRow;
