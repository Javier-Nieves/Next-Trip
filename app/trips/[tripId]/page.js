'use client';

import { useEffect, useRef, useState } from 'react';
import mapbox from '@/app/_lib/mapbox';

export default function Page({ params }) {
  const [trip, setTrip] = useState({});
  const [lat, setLat] = useState(42.35);
  const [lng, setLng] = useState(-70.9);
  const [zoom, setZoom] = useState(9);

  // waypoints - array for GeoJson creation => routes
  //   const [waypoints, setWaipoints] = useState([]);
  // features - array for the map.addSource method, contains Locations data
  //   const [features, setFeatures] = useState([]);

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
        // waypoints,
        // features,
        // setFeatures,
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

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <div className="absolute z-30 md:left-[120px] text-4xl top-8">{name}</div>
      <div ref={mapContainer} className="h-full" />
    </div>
  );
}
