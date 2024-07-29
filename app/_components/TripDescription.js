import { useState } from 'react';
import { FaInfo } from 'react-icons/fa';
import Button from './Button';

function TripDescription({ trip }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleCloseInfo = (event) => {
    // to close new location form when user clicked outside of the form
    if (event.target === event.currentTarget) {
      setDetailsOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setDetailsOpen((cur) => !cur)}
        // className="z-50 rounded-full"
      >
        <FaInfo /> Trip Details
      </Button>

      {detailsOpen && (
        <div
          className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen mx-auto bg-slate-700/70 z-[100]"
          onClick={handleCloseInfo}
        >
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
        </div>
      )}
    </>
  );
}

export default TripDescription;
