import TripCard from './_components/TripCard';
import { getPublicTrips } from './_lib/data-service';

export default async function Page() {
  // index page renders all public trips when user isn't logged in
  const trips = await getPublicTrips();
  // console.log('\x1b[36m%s\x1b[0m', 'Am I server?', trips.length);

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
