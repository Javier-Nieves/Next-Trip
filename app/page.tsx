import TripCard from './_components/TripCard';
import { getPublicTrips } from './_lib/data-service';
import { TripDocument } from '@/app/_lib/types';

export default async function Page(): Promise<JSX.Element> {
  // index page renders all public trips when user isn't logged in
  const trips: TripDocument[] = await getPublicTrips();

  return (
    <div className="flex flex-col items-center">
      <article className="grid w-full grid-cols-2 gap-4 p-4 my-6 md:gap-12 md:grid-cols-3 lg:w-2/3">
        {trips?.map((trip, i) => (
          <TripCard cardNumber={i} trip={trip} key={trip._id} />
        ))}
      </article>
    </div>
  );
}
