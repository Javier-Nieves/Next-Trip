'use client';

import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import Spinner from '@/app/_components/Spinner';
import mapbox from '@/app/_lib/mapbox';
import PhotoLink from '@/app/_components/PhotoLink';

export default function Page({ params }) {
  const [trip, setTrip] = useState({});
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

  return (
    <>
      {map.current === null && <Spinner />}
      <div className="fixed top-0 left-0 w-screen h-screen">
        <div className="absolute z-50 md:right-[120px] top-6 flex flex-col gap-2 items-end">
          <div className="text-4xl font-semibold">{name}</div>
          {duration && (
            <div className="text-xl font-normal">
              {formattedDate}, {duration} {duration > 1 ? 'days' : 'day'}
            </div>
          )}
          {travelers?.length && (
            <div className="flex gap-2">
              {travelers.map((traveler) => (
                <PhotoLink user={traveler} />
              ))}
            </div>
          )}
        </div>
        <div ref={mapContainer} className="z-30 h-full" />
      </div>
    </>
  );
}
