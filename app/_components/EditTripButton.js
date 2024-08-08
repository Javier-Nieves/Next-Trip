import Link from 'next/link';
import { FaPencilAlt } from 'react-icons/fa';
import Button from '@/app/_components/Button';

function EditTripButton({ id }) {
  return (
    <Button type="menu">
      <Link href={`/edit/${id}`}>
        <span className="flex items-center gap-1">
          <FaPencilAlt /> Edit trip
        </span>
      </Link>
    </Button>
  );
}

export default EditTripButton;
