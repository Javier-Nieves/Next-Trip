import Button from '@/app/_components/Button';
import { FaPencilAlt } from 'react-icons/fa';

function EditTripButton() {
  return (
    <Button type="menu">
      <>
        <FaPencilAlt />
        Edit trip
      </>
    </Button>
  );
}

export default EditTripButton;
