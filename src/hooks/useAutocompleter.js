import { useCallback, useEffect, useMemo, useReducer } from 'react';

const initialState = {
  activeItem: undefined,
  inputValue: '',
  filteredItems: [],
  displayItems: false,
};

//fake enum for the actions
const ActionTypes = {
  RESET_ALL: 1,
  RESET_CHANGE: 2,
  CLEAR_OPTIONS: 3,
  SHOW_OPTIONS: 4,
  EMPTY_FILTERED: 5,
  EMPTY_INPUT: 6,
  SET_INPUT: 7,
  ON_SELECT: 8,
};

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.RESET_ALL:
      return {
        ...state,
        filteredItems: initialState.filteredItems,
        displayItems: true,
        activeItem: initialState.activeItem,
      };

    case ActionTypes.RESET_CHANGE:
      return {
        ...state,
        displayItems: true,
        activeItem: initialState.activeItem,
      };

    case ActionTypes.CLEAR_OPTIONS:
      return {
        ...state,
        filteredItems: initialState.filteredItems,
        displayItems: false,
      };

    case ActionTypes.SHOW_OPTIONS:
      return { ...state, displayItems: true, filteredItems: action.payload };

    case ActionTypes.EMPTY_FILTERED:
      return { ...state, filteredItems: initialState.filteredItems };

    case ActionTypes.EMPTY_INPUT:
      return { ...state, inputValue: initialState.inputValue };

    case ActionTypes.SET_INPUT:
      return { ...state, inputValue: action.payload };

    case ActionTypes.ON_SELECT:
      return {
        ...state,
        displayItems: false,
        filteredItems: [],
        activeItem: action.payload?.['index'],
        inputValue: action.payload?.['input'],
      };

    default:
      console.error(
        `An un-recognised action type ${action} was called for autocompleter`
      );
      break;
  }
}

/**
 *
 * @param {JSON} data a JSON formatted array of searchable objects
 * @param {String} completer_field data is an array of objects with a completer field eg [{name, other_field}] might use 'name' as the autocomplete field (this is what is compared to to produce state.filteredItems)
 * @returns
 */
export function useAutocompleter(data, completer_field) {
  const [{ inputValue, filteredItems, activeItem, displayItems }, dispatch] =
    useReducer(reducer, initialState);

  //set up the array of completer field from data
  const possibles = useMemo(() => {
    return data.map((item) => item[completer_field]);
  }, [data, completer_field]);

  //I was trying to get a datalist alternative working hence the useCallback
  const handleSelect = useCallback(
    (e) => {
      e.preventDefault?.();
      const value = e.target.value;
      const indexForSelection = possibles.indexOf(value);
      dispatch({
        type: ActionTypes.ON_SELECT,
        payload: { input: value, index: indexForSelection },
      });
      return value;
    },
    [possibles]
  );

  const setInput = useCallback((input) => {
    dispatch({ type: ActionTypes.SET_INPUT, payload: input });
  }, []);

  const clearInput = useCallback(() => {
    dispatch({ type: ActionTypes.EMPTY_INPUT });
  }, []);

  const clearFiltered = useCallback(() => {
    dispatch({ type: ActionTypes.EMPTY_FILTERED });
  }, []);

  //handle the input changing and create the options
  useEffect(() => {
    //if input is empty or has been deleted reset everything
    if (inputValue.length < 1) {
      dispatch({ type: ActionTypes.RESET_ALL });
      return;
    } //or an option has been selected but then a char or more has been deleted
    else if (inputValue.length !== possibles[activeItem]?.length) {
      dispatch({ type: ActionTypes.RESET_CHANGE });
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
      dispatch({ type: ActionTypes.CLEAR_OPTIONS });
      return;
    }
    dispatch({ type: ActionTypes.SHOW_OPTIONS, payload: validOptions });
  }, [inputValue, possibles, displayItems, activeItem]);

  return {
    handleSelect,
    clearFiltered,
    clearInput,
    setInput,
    state: { inputValue, filteredItems, activeItem, displayItems },
  };
}
