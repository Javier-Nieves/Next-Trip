import Button from '@/app/_components/Button';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { useRemoveLocation } from '@/app/trips/[tripId]/useRemoveLocation';
import Image from 'next/image';
import { useState } from 'react';
import Backdrop from './Backdrop';

function LocationInfo({ location, setLocationInfo, isMyTrip }) {
  const { removeLocation } = useRemoveLocation();
  const [photoFocused, setPhotoFocused] = useState(null);
  const images = JSON.parse(location.images);

  async function handleDeleteLocation(name) {
    removeLocation(name);
    setLocationInfo(null);
  }

  return (
    <div className="absolute flex items-center justify-center w-full h-full">
      <div className="bottom-[150px] absolute z-50 w-3/4 lg:w-[500px] bg-[var(--color-light)] p-4 rounded-lg  flex flex-col items-center gap-2">
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
          <div className="flex flex-col items-center gap-3 text-lg">
            <span className="flex flex-wrap justify-center w-full gap-2">
              {images.map((image) => (
                <div
                  key={image}
                  className="relative flex-shrink-0 h-full hover:cursor-pointer"
                  onClick={() => setPhotoFocused(image)}
                >
                  <Image
                    src={image}
                    // fill
                    placeholder="blur"
                    height={100}
                    width={100}
                    blurDataURL={`/_next/image?url=${image}&w=16&q=1`}
                    className="object-contain h-full"
                    alt="Location picture"
                  />
                </div>
                // <img src={image} key={image} />
              ))}
            </span>
          </div>
        )}
        {isMyTrip && (
          <div className="flex items-center gap-1">
            <Button
              type="bright"
              // todo
              // onClick={() => handleDeleteLocation(location.name)}
            >
              <FaPencilAlt />
              Edit
            </Button>
            <Button
              type="delete"
              onClick={() => handleDeleteLocation(location.name)}
            >
              <FaTrashAlt />
              Delete
            </Button>
          </div>
        )}
      </div>
      {photoFocused && (
        <Backdrop
          onClick={() => setPhotoFocused(null)}
          photos={images}
          photoFocused={photoFocused}
        />
      )}
    </div>
  );
}

export default LocationInfo;
