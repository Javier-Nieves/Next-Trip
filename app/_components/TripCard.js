import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getTripInfo, getUserInfo } from '../_lib/data-service';
import PhotoLink from './PhotoLink';

async function TripCard({ trip, cardNumber }) {
  const { isFriend, isMe } = await getUserInfo(trip.createdBy);
  const { travelersArray } = await getTripInfo(trip._id);

  const isBigCard = cardNumber < 3;

  const formattedDate = trip.date ? format(trip.date, 'dd MMMM yyyy') : '';

  // Link is separates in two parts to avoid hydration error (nested Links don't work)
  return (
    <div
      className={`${
        isBigCard ? 'w-full' : 'md:w-4/5 md:mx-auto'
      } bg-white shadow-lg ease-in-out duration-300 rounded-lg overflow-hidden aspect-[2/3] relative ${isFriend ? 'outline outline-[var(--color-orange)] outline-offset-4' : ''} ${isMe ? 'outline outline-[var(--color-green)]  outline-offset-4' : ''} hover:scale-[1.01] hover:cursor-pointer max-w-[300px]`}
    >
      {(isFriend || isMe) && (
        <div
          className={`absolute px-10 py-1 text-xs font-bold text-white origin-top-right transform rotate-45 ${isMe ? (trip.private ? 'bg-[var(--color-dark-green)]' : 'bg-[var(--color-green)]') : trip.private ? 'bg-[var(--color-dark-orange)]' : 'bg-[var(--color-orange)]'} top-14 -right-6 z-40`}
        >
          {isMe
            ? trip.private
              ? 'Private'
              : 'My trip'
            : trip.private
              ? 'Private'
              : 'Friend'}
        </div>
      )}
      <Link href={`/trips/${trip.id}`}>
        <div className="relative h-1/2 md:h-2/3">
          <Image
            src={trip.coverImage}
            alt={trip.name}
            fill
            placeholder="blur"
            blurDataURL={`/_next/image?url=${trip.coverImage}&w=16&q=1`}
            sizes="300px"
            className="object-cover w-full h-full"
          />
        </div>
      </Link>

      <PhotoLink
        type="card"
        travelersArray={travelersArray}
        big={isBigCard}
        position={
          'absolute -translate-x-1/2 -translate-y-1/2 top-1/2 md:top-2/3 left-1/2'
        }
      />

      <Link href={`/trips/${trip.id}`}>
        <div className="flex flex-col justify-center p-4 text-center h-1/3">
          <h2
            className={`${isBigCard ? 'text-2xl' : 'text-xl'} font-semibold mt-7`}
          >
            {trip.name}
          </h2>
          <p className="text-gray-600">{formattedDate || ''}</p>
        </div>
      </Link>
    </div>
  );
}

export default TripCard;
