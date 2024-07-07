import { useState } from 'react';

function LocationInfo({ location }) {
  return (
    <div className="absolute z-50 h-1/2 w-[400px] bg-[var(--color-accent-base)] p-4 rounded-lg  flex flex-col items-center transform translate-y-1/2 right-[6rem] gap-4">
      <button
        onClick={() => setLocationInfoOpen(null)}
        className="absolute top-3 right-3"
      >
        &#10005;
      </button>
      <p className="text-3xl">{locationInfoOpen.name}</p>
      <p className="grid grid-cols-[100px,1fr] w-full text-lg">
        <span>Address: </span>
        <span>{locationInfoOpen.address || ' -'}</span>
      </p>
      <p className="grid grid-cols-[100px,1fr] w-full text-lg">
        <span>Description: </span>
        <span>{locationInfoOpen.desc || ' -'}</span>
      </p>
      <p className="grid grid-cols-[100px,1fr] w-full text-lg">
        <span>Images:</span>
        <span className="grid">{locationInfoOpen.images}</span>
      </p>
    </div>
  );
}

export default LocationInfo;
