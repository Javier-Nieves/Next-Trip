'use client';

import { useEffect, useRef, useState } from 'react';
import mapbox from '@/app/_lib/mapbox';

export default async function Page() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lat, setLat] = useState(42.35);
  const [lng, setLng] = useState(-70.9);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return;

    map.current = mapbox({
      lat,
      lng,
      zoom,
      mapContainer: mapContainer.current,
    });
  });

  return (
    <div>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: '400px' }}
      />
    </div>
  );
}
