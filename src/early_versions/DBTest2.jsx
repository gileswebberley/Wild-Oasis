import styled from 'styled-components';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { useEffect } from 'react';
import { iDB } from '../utils/shared_constants';
import Spinner from '../ui/Spinner';
import { addDays } from 'date-fns';

const TestContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

function DBTest2() {
  const {
    isDBBusy,
    errors,
    data,
    getCurrentData,
    updateCurrentData,
    createCurrentObject,
    currentObjectId,
    getByNonKey,
    deleteCurrentObject,
  } = useIndexedDB(iDB.name);

  //{
  //       guestId: 67,
  //       cabinId: 12,
  //       totalGuests: 5,
  //}

  useEffect(() => {
    if (!isDBBusy) {
      getByNonKey(iDB.store, 'guestId', 67);
    } //getCurrentData(iDB.store);}
  }, [isDBBusy, getByNonKey]);

  const updateTest = () => {
    if (!isDBBusy) {
      updateCurrentData(iDB.store, {
        startDate: new Date(),
        endDate: addDays(new Date(), 5),
      });
    }
  };
  const deleteTest = () => {
    if (!isDBBusy) {
      deleteCurrentObject(iDB.store);
    }
  };

  if (isDBBusy) return <Spinner />;

  return (
    <TestContainer>
      <div>busy:{isDBBusy}</div>
      <div>errors:{errors}</div>
      <div>data:{JSON.stringify(data)}</div>
      <button onClick={updateTest}>Click update</button>
      <button onClick={deleteTest}>delete</button>
    </TestContainer>
  );
}

export default DBTest2;
