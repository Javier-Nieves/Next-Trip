'use client';

import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import Spinner from '@/app/_components/Spinner';
import mapbox from '@/app/_lib/mapbox';
import PhotoLink from '@/app/_components/PhotoLink';

export default function Page({ params }) {
  const [trip, setTrip] = useState({});
  const [detailsOpen, setDetailsOpen] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);

  // get trip info & display map
  useEffect(function () {
    async function displayMap() {
      const res = await fetch(`/api/trips/${params.tripId}`);
      const data = await res.json();
      //   console.log(data.data.trip);
      setTrip(data.data.trip);

      if (map.current) return;
      map.current = mapbox({
        mapContainer: mapContainer.current,
        locations: data.data.trip.locations,
      });
    }
    displayMap();
  }, []);

  const {
    coverImage,
    createdBy,
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
        <div
          onClick={() => setDetailsOpen((cur) => !cur)}
          className={`${detailsOpen ? 'bg-[var(--color-light-yellow)] w-[400px] left-[50px] h-[450px]' : 'bg-[var(--color-yellow)] w-[150px] left-[100px] h-[50px]'} $ absolute z-50 top-[100px] px-4 py-3 rounded-md text-xl font-medium hover:bg-[var(--color-light-yellow)] text-center transition-all duration-500 md:block hidden`}
        >
          {!detailsOpen && 'Trip details'}
          {detailsOpen && (
            <div>
              <h1>{highlight}</h1>
              <p>{description}</p>
            </div>
          )}
        </div>

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
        </div>
        <div ref={mapContainer} className="z-30 w-full h-full" />
      </div>
    </>
  );
}
