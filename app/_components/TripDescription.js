import { useState } from 'react';

function TripDescription({ highlight, description }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
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
  );
}

export default TripDescription;
