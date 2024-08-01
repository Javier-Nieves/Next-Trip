import { useState } from 'react';
import { FaInfo } from 'react-icons/fa';
import Button from './Button';
import Backdrop from './Backdrop';

function TripDescription({ trip, setLocationInfo }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleClick = () => {
    setDetailsOpen((cur) => !cur);
    setLocationInfo(null);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        // className="z-50 rounded-full"
      >
        <FaInfo /> Trip Details
      </Button>

      {detailsOpen && (
        <Backdrop onClick={() => setDetailsOpen(false)}>
          <div className="relative w-3/4 lg:w-1/2 backdrop-blur-1 bg-[var(--color-light-yellow)] rounded-lg p-5">
            <button
              onClick={() => setDetailsOpen(false)}
              className="absolute top-3 right-3"
            >
              &#10005;
            </button>
            <div className="flex items-center w-full gap-5">
              <div>
                <img
                  src={trip.coverImage}
                  alt="Cover image for the trip"
                  className="rounded-lg"
                />
              </div>
              <div className="px-10 text-4xl text-center">{trip.highlight}</div>
            </div>
            <div className="p-3 leading-relaxed">{trip.description}</div>
          </div>
        </Backdrop>
      )}
    </>
  );
}

export default TripDescription;
