import Link from 'next/link';
import travelerImage from '../../public/user.png';

function PhotoLink({ name, photo, trip }) {
  return (
    <div>
      <div className="absolute overflow-hidden duration-300 ease-in-out transform -translate-x-1/2 -translate-y-1/2 border-4 border-white rounded-full w-[3.2rem] hover:cursor-pointer hover:scale-105 top-1/2 md:top-2/3 left-1/2 aspect-square">
        <Link href={`/collections/${trip.createdBy}`}>
          <img
            src={photo || travelerImage}
            alt="Traveler"
            // layout="fill"
            // objectFit="cover"
            className="object-cover w-full h-full"
          />
        </Link>
      </div>
      {/* <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-100">
    <div className="p-1 bg-orange-300 rounded-md">{name}</div>
  </div> */}
    </div>
  );
}

export default PhotoLink;
