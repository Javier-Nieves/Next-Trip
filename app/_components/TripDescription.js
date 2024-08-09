import { useState } from 'react';
import { FaInfo, FaPencilAlt } from 'react-icons/fa';
import Button from './Button';
import Backdrop from './Backdrop';
import PhotoLink from './PhotoLink';
import { format } from 'date-fns';
import Link from 'next/link';

function TripDescription({ trip, setLocationInfo }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleClick = () => {
    setDetailsOpen((cur) => !cur);
    setLocationInfo(null);
  };

  return (
    <>
      <Button onClick={handleClick}>
        <FaInfo /> Trip Details
      </Button>

      {detailsOpen && (
        <Backdrop onClick={() => setDetailsOpen(false)}>
          <div className="relative w-3/4 lg:w-3/5 backdrop-blur-1 bg-[var(--color-light-yellow)] rounded-lg p-5 flex gap-2 flex-col items-center">
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

              {trip.highlight && (
                <div className="px-10 text-4xl text-center">
                  {trip.highlight}
                </div>
              )}
            </div>

            {trip.description && (
              <div className="p-3 leading-relaxed">{trip.description}</div>
            )}

            {trip?.travelers?.length !== 0 && (
              <span className="flex items-center gap-2">
                <span className="text-xl">With:</span>
                <div className="flex gap-2">
                  <PhotoLink
                    travelersArray={trip?.travelersArray}
                    type="desc"
                  />
                </div>
              </span>
            )}
            {trip.date && (
              <span className="text-xl">
                Trip date: {format(trip.date, 'dd.MM.yyyy')}, {trip.duration}{' '}
                days
              </span>
            )}

            {trip.isMyTrip && (
              <Button type="bright">
                <Link href={`/edit/${trip._id}`}>
                  <span className="flex items-center gap-1">
                    <FaPencilAlt /> Edit trip
                  </span>
                </Link>
              </Button>
            )}
          </div>
        </Backdrop>
      )}
    </>
  );
}

export default TripDescription;
