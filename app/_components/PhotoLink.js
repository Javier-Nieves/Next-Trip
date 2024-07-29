import Link from 'next/link';
import travelerImage from '../../public/user.png';
import Spinner from './Spinner';

function PhotoLink({ travelersArray, type, big }) {
  if (!travelersArray.length) return <Spinner />;
  // display photo of the trip's creator of up to 3 photos of trip's travelers
  return (
    <div
      className={`absolute flex gap-2 ${type === 'inTrip' ? '' : 'w-full -translate-y-1/2 justify-center'}`}
    >
      {travelersArray?.map((traveler) => (
        <div
          className="relative flex flex-col items-center group"
          key={traveler.id}
        >
          <div
            className={` z-50 overflow-hidden duration-300 ease-in-out transform  border-4 border-white rounded-full ${big ? 'w-[4rem]' : 'w-[3.2rem]'} hover:cursor-pointer hover:scale-105 aspect-square`}
          >
            <Link href={`/collections/${traveler.id}`}>
              <img
                src={traveler.photo || travelerImage}
                alt="Traveler"
                className="object-cover w-full h-full"
              />
            </Link>
          </div>
          <div
            className={`absolute hidden items-center justify-center transition duration-300 opacity-0 group-hover:flex group-hover:opacity-100 ${big ? 'top-[3.8rem]' : 'top-[3rem]'} z-30`}
          >
            <div className="p-1 text-sm text-center bg-blue-100 rounded-md whitespace-nowrap">
              {traveler.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PhotoLink;
