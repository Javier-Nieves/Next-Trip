'use client';

import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import Spinner from '@/app/_components/Spinner';
import mapbox from '@/app/_lib/mapbox';
import PhotoLink from '@/app/_components/PhotoLink';

export default function Page({ params }) {
  const [trip, setTrip] = useState({});
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isEditingSession, setIsEditingSession] = useState(true);
  const [isHike, setIsHike] = useState(false);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const isMyTrip = useRef(null);

  //! get trip info & display map
  useEffect(
    function () {
      async function displayMap() {
        const res = await fetch(`/api/trips/${params.tripId}`);
        const data = await res.json();
        setTrip(data.data.trip);
        // console.log('\x1b[36m%s\x1b[0m', 'front trip', data.data.trip);
        isMyTrip.current = data.data.isMyTrip;

        // map container should be empty to render a new map (with editing)
        if (map.current) mapContainer.current.innerHTML = '';
        map.current = mapbox({
          mapContainer: mapContainer.current,
          locations: data.data.trip.locations,
          isEditingSession,
          isHike,
        });
      }
      displayMap();
    },
    [isEditingSession, isHike],
  );

  const {
    coverImage,
    date,
    description,
    duration,
    highlight,
    locations,
    name,
    travelers,
  } = trip;

  const formattedDate = date ? format(date, 'dd.MM.yyyy') : '';
  const hasDate = typeof duration === 'number' && !Number.isNaN(+duration);

  return (
    <>
      {map.current === null && <Spinner />}
      <div className="fixed top-0 left-0 w-screen h-screen">
        {(highlight || description) && !isEditingSession && (
          <div
            onClick={() => setDetailsOpen((cur) => !cur)}
            className={`${detailsOpen ? 'bg-[var(--color-light-yellow)] w-[400px] left-[50px] h-[450px]' : 'bg-[var(--color-yellow)] w-[150px] left-[100px] h-[50px]'} absolute z-50 top-[100px] px-4 py-3 rounded-md text-xl font-medium hover:bg-[var(--color-light-yellow)] text-center transition-all duration-500 md:block hidden`}
          >
            {!detailsOpen && (highlight || description) && 'Trip details'}
            {detailsOpen && (
              <div>
                <h1>{highlight}</h1>
                <p>{description}</p>
              </div>
            )}
          </div>
        )}

        <div className="absolute z-50 right-5 md:right-[20px] lg:right-[100px] top-6 flex flex-col gap-2 items-end">
          <div className="text-4xl font-semibold">{name}</div>
          {hasDate && (
            <div className="text-xl font-normal">
              {formattedDate}, {duration} {duration > 1 ? 'days' : 'day'}
            </div>
          )}

          {travelers?.length && (
            <div className="flex gap-2">
              {travelers.map((traveler) => (
                <PhotoLink user={traveler} key={traveler._id} />
              ))}
            </div>
          )}

          {isMyTrip.current && (
            <button
              onClick={() => setIsEditingSession((cur) => !cur)}
              className={`${isEditingSession ? 'bg-[var(--color-accent-base)] hover:bg-[var(--color-accent-dark)]' : 'bg-[var(--color-light-yellow)] hover:bg-[var(--color-yellow)]'} p-2 mt-2 rounded-md text-lg`}
            >
              {isEditingSession ? 'Back to trip' : 'Edit locations'}
            </button>
          )}

          {isEditingSession && (
            <div className="flex items-center mt-2 space-x-2">
              <span
                className={`text-xl font-medium ${isHike ? 'text-black' : 'text-gray-500'}`}
              >
                Hike
              </span>
              <div
                className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300 ${isHike ? 'bg-[var(--color-accent-base)]' : 'bg-[var(--color-yellow)]'}`}
                onClick={() => setIsHike((cur) => !cur)}
              >
                <span
                  className={`absolute left-1 inline-block h-4 w-4 bg-black rounded-full transform transition-transform duration-300 ${isHike ? 'translate-x-0' : 'translate-x-6'}`}
                ></span>
              </div>
              <span
                className={`text-xl font-medium ${isHike ? 'text-gray-500' : 'text-black'}`}
              >
                Drive
              </span>
            </div>
          )}
        </div>
        <div ref={mapContainer} className="z-30 w-full h-full" />
      </div>
    </>
  );
}
