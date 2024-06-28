import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';
import travelerImage from '../../public/user.png';
import { getUserInfo } from '../_lib/data-service';
import { relative } from 'path';

async function TripCard({ trip, cardNumber }) {
  const { name, photo, isFriend, isMe } = await getUserInfo(trip.createdBy);
  // todo make a popup make of the traveler
  // console.log('\x1b[36m%s\x1b[0m', 'createdBy', photo);

  const formattedDate = trip.date ? format(trip.date, 'dd MMMM yyyy') : '';
  return (
    <div
      className={`${
        cardNumber < 3 ? 'w-full' : 'md:w-4/5 md:mx-auto'
      } bg-white shadow-lg rounded-lg overflow-hidden aspect-[2/3] relative ${isFriend ? 'outline outline-cyan-500 outline-offset-1' : ''} ${isMe ? 'outline outline-lime-500 outline-offset-1' : ''}`}
    >
      <div className="relative h-1/2 md:h-2/3">
        <Image
          src={trip.coverImage}
          alt={trip.name}
          fill
          // placeholder="blur"
          sizes="300px"
          className="object-cover w-full h-full"
        />
      </div>
      {travelerImage && (
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
      )}

      <div className="flex flex-col justify-center p-4 text-center h-1/3">
        <h2 className="text-lg font-semibold mt-7">{trip.name}</h2>
        <p className="text-gray-600">{formattedDate}</p>
      </div>
    </div>
  );
}

export default TripCard;

// {
//   _id: new ObjectId('652c74f6d5f82888a6b7aee8'),
//   name: 'Big Colombia Trip',
//   travelers: [ [Object], [Object] ],
//   description: 'test',
//   date: 2020-07-23T00:00:00.000Z,
//   highlight: 'Across all country in a car',
//   private: false,
//   createdBy: '66795378a059a9fb42c4ec22',
//   duration: '3 weeks',
//   coverImage: 'trip-65444d163218278ffd2104f2-1699660062616.jpeg'
// }

// return (
//   <section className="border rounded-lg border-slate-500 relative overflow-hidden h-[400px] aspect-[2/3] m-auto">
//     <Image
//       className="object-cover -z-10 absolute top-0 !h-1/2"
//       src={coverImage}
//       fill
//       quality={40}
//       placeholder="blur"
//       alt="default trip picture"
//     />
//     <div className="flex flex-col bg-slate-100 mt-[200px] py-5 absolute bottom-0 w-full !h-1/2">
//       <div className="text-center">{formattedDate}</div>
//       <h1 className="text-xl text-center">{trip.name}</h1>
//     </div>
//   </section>
// );
