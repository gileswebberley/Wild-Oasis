import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { useUser } from '../authentication/useUser';

const GuestContext = createContext();
const GuestApiContext = createContext();

const initialState = {
  fullName: '',
  guestEmail: '',
  nationalId: '',
  nationality: '',
  countryFlag: '',
  startDate: null,
  endDate: null,
  cabinID: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'setName':
      return { ...state, fullName: action.payload };
    case 'setEmail':
      return { ...state, guestEmail: action.payload };
    case 'setNationalId':
      return { ...state, nationalId: action.payload };
    case 'setCountry':
      return {
        ...state,
        nationality: action.payload.country,
        countryFlag: action.payload.flag,
      };

    case 'setStay':
      return {
        ...state,
        startDate: action.payload.start,
        endDate: action.payload.end,
        cabinID: action.payload.cabinId,
      };
    case 'clearStay':
      return {
        ...state,
        startDate: null,
        endDate: null,
        cabinID: null,
      };
    default:
      throw new Error('Guest context does not recognise the action type');
  }
}

//So I've used anonymous sign-in alomg with the meta-data I can store with it for most of this but now we're getting into putting the booking together I've decided to repurpose it for that
function GuestContextProvider({ children }) {
  // const { user, isCheckingUser, isAnonymous } = useUser();
  const [state, dispatch] = useReducer(reducer, initialState);
  //seperating concerns, so put the setter functions in one context and the readable state in the other
  const api = useMemo(() => {
    const setName = (name) => {
      dispatch({ type: 'setName', payload: name });
    };
    const setEmail = (email) => {
      dispatch({ type: 'setEmail', payload: email });
    };
    const setNationalId = (NId) => {
      dispatch({ type: 'setNationalId', payload: NId });
    };
    const setCountry = (country, flag) => {
      dispatch({ type: 'setCountry', payload: { country, flag } });
    };
    const setStay = (start, end, cabinId) => {
      dispatch({ type: 'setStay', payload: { start, end, cabinId } });
    };
    const clearStay = () => {
      dispatch({ type: 'clearStay' });
    };
    return { setName, setEmail, setNationalId, setCountry, setStay, clearStay };
  }, [dispatch]);

  return (
    <GuestApiContext.Provider value={api}>
      <GuestContext.Provider value={state}>{children}</GuestContext.Provider>
    </GuestApiContext.Provider>
  );
}

function useGuestContext() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('GuestContext was used outside of GuestContextProvider');
  }
  return context;
}
function useGuestApiContext() {
  const context = useContext(GuestApiContext);
  if (context === undefined) {
    throw new Error('GuestApiContext was used outside of GuestContextProvider');
  }
  return context;
}

export { useGuestContext, useGuestApiContext, GuestContextProvider };
