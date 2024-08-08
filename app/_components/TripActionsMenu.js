import AddLocationsButton from '@/app/_components/AddLocationsButton';
import DeleteTripButton from '@/app/_components/DeleteTripButton';
import EditTripButton from '@/app/_components/EditTripButton';
import ExpandableMenu from './ExpandableMenu';
import { FaBars } from 'react-icons/fa';

function TripActionsMenu({ handleAddLocation, isEditingSession, id }) {
  return (
    <ExpandableMenu
      icon={
        <>
          <FaBars />
          Modify trip
        </>
      }
    >
      <AddLocationsButton
        handleAddLocation={handleAddLocation}
        isEditingSession={isEditingSession}
        type="menu"
      />
      <EditTripButton id={id} />
      <DeleteTripButton />
    </ExpandableMenu>
  );
}

export default TripActionsMenu;
