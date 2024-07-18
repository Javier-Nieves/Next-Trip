import Button from '@/app/_components/Button';
import { FaTrashAlt } from 'react-icons/fa';
import { useRemoveLocation } from '@/app/trips/[tripId]/useRemoveLocation';

function LocationInfo({ location, setLocationInfo }) {
  const { removeLocation } = useRemoveLocation();
  const images = JSON.parse(location.images);
  let columns;
  switch (images.length) {
    case 1:
      columns = 1;
      break;
    case 2:
    case 4:
      columns = 2;
      break;
    default:
      columns = 3;
  }
  async function handleDeleteLocation(name) {
    removeLocation(name);
    setLocationInfo(null);
  }

  return (
    <div className="absolute flex items-center justify-center w-full h-full">
      <div className="bottom-[150px] absolute z-50 w-3/4 lg:w-[500px] bg-[var(--color-light)] p-4 rounded-lg  flex flex-col items-center gap-4">
        <button
          onClick={() => setLocationInfo(null)}
          className="absolute top-3 right-3"
        >
          &#10005;
        </button>
        <p className="text-3xl font-semibold">{location.name}</p>
        {location.address && (
          <p className="grid grid-cols-[110px,1fr] w-full text-lg">
            <span className="font-semibold">Address: </span>
            <span>{location.address || ' -'}</span>
          </p>
        )}
        {location.desc && (
          <p className="grid grid-cols-[110px,1fr] w-full text-lg">
            <span className="font-semibold">Description: </span>
            <span>{location.desc || ' -'}</span>
          </p>
        )}
        {images.length > 0 && (
          <p className="flex flex-col items-center w-full gap-3 text-lg">
            {/* <span className="font-semibold">Images:</span> */}
            <span className={`grid grid-cols-${columns} gap-2`}>
              {images.map((image) => (
                <img src={image} key={image} />
              ))}
            </span>
          </p>
        )}
        <Button
          type="delete"
          onClick={() => handleDeleteLocation(location.name)}
        >
          <FaTrashAlt />
          Delete
        </Button>
      </div>
    </div>
  );
}

export default LocationInfo;
