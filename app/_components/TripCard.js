import Image from 'next/image';
import { format } from 'date-fns';
import coverImage from '../../public/default-trip.jpeg';
import travelerImage from '../../public/user.png';

function TripCard({ trip, cardNumber }) {
  //   console.log(trip);
  const formattedDate = format(trip.date, 'dd MMMM yyyy');

  return (
    <div
      className={`${
        cardNumber < 3 ? 'w-full' : 'w-4/5 mx-auto'
      } bg-white shadow-lg rounded-lg overflow-hidden aspect-[2/3] relative`}
    >
      <div className="relative h-2/3">
        <Image
          src={coverImage}
          alt={trip.name}
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>
      {travelerImage && (
        <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14  aspect-square rounded-full overflow-hidden border-4 border-white">
          <Image
            src={travelerImage}
            alt="Traveler"
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
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
