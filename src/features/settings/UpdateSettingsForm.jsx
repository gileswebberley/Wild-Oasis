import toast from 'react-hot-toast';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';
import { useSettings } from './useSettings';
import { useUpdateSetting } from './useUpdateSetting';

function UpdateSettingsForm() {
  //destructure an empty object to avoid undefined error whilst loading settings
  const {
    isLoading,
    settings: {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
    } = {},
    error,
  } = useSettings();

  const { updateSetting, isUpdatingSetting } = useUpdateSetting();

  function handleUpdate(e, fieldName) {
    const { value, defaultValue } = e.target;
    //check that the value has changed rather than just being tabbed past
    if (!value || Number(defaultValue) === Number(value))
      return (e.target.value = defaultValue);
    updateSetting({ [fieldName]: value });
  }

  function handleValidate(e) {
    const { value } = e.target;
    if (value < 0) {
      toast.error('Negative values are not permitted');
      return (e.target.value = 0);
    }
  }

  if (isLoading) return <Spinner />;
  if (error) return <div>ERROR: {error}</div>;

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          defaultValue={minBookingLength}
          disabled={isUpdatingSetting}
          onBlur={(e) => handleUpdate(e, 'minBookingLength')}
          onChange={(e) => handleValidate(e)}
        />
      </FormRow>
      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          id="max-nights"
          defaultValue={maxBookingLength}
          disabled={isUpdatingSetting}
          onBlur={(e) => handleUpdate(e, 'maxBookingLength')}
          onChange={(e) => handleValidate(e)}
        />
      </FormRow>
      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          defaultValue={maxGuestsPerBooking}
          disabled={isUpdatingSetting}
          onBlur={(e) => handleUpdate(e, 'maxGuestsPerBooking')}
          onChange={(e) => handleValidate(e)}
        />
      </FormRow>
      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={breakfastPrice}
          disabled={isUpdatingSetting}
          onBlur={(e) => handleUpdate(e, 'breakfastPrice')}
          onChange={(e) => handleValidate(e)}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
