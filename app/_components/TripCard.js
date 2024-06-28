import Image from 'next/image';
import { format } from 'date-fns';
import travelerImage from '../../public/user.png';
import { getUserInfo } from '../_lib/data-service';
import Link from 'next/link';

async function TripCard({ trip, cardNumber }) {
  const { name, photo } = await getUserInfo(trip.createdBy);
  // console.log('\x1b[36m%s\x1b[0m', 'createdBy', photo);

  const formattedDate = trip.date ? format(trip.date, 'dd MMMM yyyy') : '';
  // return (
  //   <div class="relative w-64 h-64 bg-blue-500">
  //     <div class="absolute inset-0 flex items-center justify-center">
  //       <div class="bg-white p-4 rounded shadow">This is a centered div.</div>
  //     </div>
  //   </div>
  // );
  return (
    <div
      className={`${
        cardNumber < 3 ? 'w-full' : 'w-4/5 mx-auto'
      } bg-white shadow-lg rounded-lg overflow-hidden aspect-[2/3] relative`}
    >
      <div className="relative h-2/3">
        <Image
          src={trip.coverImage}
          alt={trip.name}
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>
      {travelerImage && (
        <div className="relative">
          <div className="ease-in-out duration-300 hover:cursor-pointer hover:scale-105 absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14  aspect-square rounded-full overflow-hidden border-4 border-white">
            <Link href={`/collections/${trip.createdBy}`}>
              <img
                src={photo}
                alt="Traveler"
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
            </Link>
          </div>
          {/* <div className="transition-opacity duration-300 absolute inset-0 group-hover:opacity-100 flex items-center justify-center">
            <div className="bg-orange-300 rounded-md p-1">{name}</div>
          </div> */}
        </div>
      )}
      <div className="h-1/3 p-4 flex flex-col justify-center">
        <h2 className="text-lg font-semibold">{trip.name}</h2>
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
//       <h1 className="text-center text-xl">{trip.name}</h1>
//     </div>
//   </section>
// );
