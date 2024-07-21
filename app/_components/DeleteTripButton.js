import { useTransition } from 'react';
import { FaSkull } from 'react-icons/fa';
import Button from '@/app/_components/Button';
import { useDeleteTrip } from '@/app/trips/[tripId]/useDeleteTrip';

function DeleteTripButton() {
  const { deleteTrip, isDeleting } = useDeleteTrip();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm('Are you sure you want to delete the trip?')) deleteTrip();
    // startTransition(deleteTrip);
  }
  return (
    <Button type="delete" disabled={isPending} onClick={handleDelete}>
      <>
        <FaSkull />
        {isPending ? 'Deleting...' : 'Delete trip'}
      </>
    </Button>
  );
}

export default DeleteTripButton;
