import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getUserInfo } from '../_lib/data-service';
import PhotoLink from './PhotoLink';

async function TripCard({ trip, cardNumber }) {
  const { name, photo, isFriend, isMe } = await getUserInfo(trip.createdBy);
  // todo make a popup make of the traveler
  // console.log('\x1b[36m%s\x1b[0m', 'createdBy', photo);

  const formattedDate = trip.date ? format(trip.date, 'dd MMMM yyyy') : '';

  // Link is separates in two parts to avoid hydration error (nested Links don't work)
  return (
    <div
      className={`${
        cardNumber < 3 ? 'w-full' : 'md:w-4/5 md:mx-auto'
      } bg-white shadow-lg ease-in-out duration-300 rounded-lg overflow-hidden aspect-[2/3] relative ${isFriend ? 'outline outline-cyan-500 outline-offset-2' : ''} ${isMe ? 'outline outline-lime-500 outline-offset-2' : ''} hover:scale-[1.01] hover:cursor-pointer`}
    >
      <Link href={`/trips/${trip.id}`}>
        <div className="relative h-1/2 md:h-2/3">
          <Image
            src={trip.coverImage}
            alt={trip.name}
            fill
            sizes="300px"
            className="object-cover w-full h-full"
          />
        </div>
      </Link>

      <PhotoLink name={name} photo={photo} trip={trip} />

      <Link href={`/trips/${trip.id}`}>
        <div className="flex flex-col justify-center p-4 text-center h-1/3">
          <h2 className="text-lg font-semibold mt-7">{trip.name}</h2>
          <p className="text-gray-600">{formattedDate}</p>
        </div>
      </Link>
    </div>
  );
}

export default TripCard;
