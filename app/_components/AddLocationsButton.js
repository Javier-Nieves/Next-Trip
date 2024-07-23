import { FaCompass, FaFlag } from 'react-icons/fa';
import Button from '@/app/_components/Button';

function AddLocationsButton({
  handleAddLocation,
  isEditingSession,
  type = 'button',
}) {
  return (
    <Button onClick={handleAddLocation} type={type}>
      {isEditingSession ? (
        <>
          <FaFlag />
          Back to the trip
        </>
      ) : (
        <>
          <FaCompass />
          Edit locations
        </>
      )}
    </Button>
  );
}

export default AddLocationsButton;
