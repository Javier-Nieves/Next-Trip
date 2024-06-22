import Image from 'next/image';
import { format } from 'date-fns';
import defaultBg from '@/public/default-trip.jpeg';

function TripCard({ trip }) {
  //   console.log(trip);
  const formattedDate = format(trip.date, 'dd MMMM yyyy');
  return (
    <section className="border rounded-lg border-slate-500 relative overflow-hidden h-[400px] aspect-[2/3] m-auto">
      <Image
        className="object-cover -z-10 absolute top-0 !h-1/2"
        src={defaultBg}
        fill
        quality={40}
        placeholder="blur"
        alt="default trip picture"
      />
      <div className="flex flex-col bg-slate-100 mt-[200px] py-5 absolute bottom-0 w-full !h-1/2">
        <div className="text-center">{formattedDate}</div>
        <h1 className="text-center text-xl">{trip.name}</h1>
      </div>
    </section>
  );
}

export default TripCard;
