import { useEffect, useState } from 'react';
import countries_data from '../data/countries_list.json';
import Autocompleter from './Autocompleter';
import styled from 'styled-components';
import { Flag } from './Flag';
import { useGuestApiContext } from '../features/guest/GuestContext';

const StyledCountryInput = styled.div`
  display: flex;
  gap: 2rem;
`;

const CountryFlag = styled(Flag)`
  max-width: 5rem;
  font-size: 1rem;
`;

function CountryInput() {
  const [countryIndex, setCountryIndex] = useState(null);
  const countryObject = countries_data[countryIndex] ?? {};
  // countryIndex !== null ? countries_data[countryIndex] : {};
  const countryFlag = countryIndex
    ? `https://flagcdn.com/${countryObject?.Code?.toLowerCase()}.svg`
    : null;
  const countryName = countryObject?.Name ?? null;
  const { setCountry } = useGuestApiContext();

  //   console.log('COUNTRY INPUT...');

  useEffect(() => {
    if (!countryFlag || !countryName) setCountry('', '');
    setCountry(countryName, countryFlag);
  }, [countryFlag, countryName, setCountry]);

  return (
    <StyledCountryInput>
      <Autocompleter
        data={countries_data}
        setindex={setCountryIndex}
        completer_field="Name"
        ref={null}
      />
      {countryObject?.Code && (
        <CountryFlag src={countryFlag} alt={`flag of ${countryObject?.Name}`} />
      )}
    </StyledCountryInput>
  );
}

export default CountryInput;
