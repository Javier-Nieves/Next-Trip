import Link from 'next/link';
import travelerImage from '../../public/user.png';

function PhotoLink({ user, position }) {
  const { name, photo, _id: id } = user;
  return (
    <div className="relative flex flex-col items-center group">
      <div
        className={`${position || ''} z-50 overflow-hidden duration-300 ease-in-out transform  border-4 border-white rounded-full w-[3.2rem] hover:cursor-pointer hover:scale-105 aspect-square`}
      >
        <Link href={`/collections/${id}`}>
          <img
            src={photo || travelerImage}
            alt="Traveler"
            className="object-cover w-full h-full"
          />
        </Link>
      </div>
      <div
        className={`absolute hidden items-center justify-center transition duration-300 opacity-0 group-hover:flex group-hover:opacity-100 ${position ? 'top-[1.3rem]' : 'top-[3.3rem]'} z-30`}
      >
        <div className="p-1 text-sm text-center bg-blue-100 rounded-md whitespace-nowrap">
          {name}
        </div>
      </div>
    </div>
  );
}

export default PhotoLink;
