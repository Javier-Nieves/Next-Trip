import TripCard from './_components/TripCard';
import { getPublicTrips } from './_lib/data-service';

// export const metadata = {
//   title: 'Hello',
// };

export default async function Page() {
  // index page renders all public trips when user isn't logged in
  // todo: + all friends's private trips when user is logged in

  const trips = await getPublicTrips();

  return (
    <div className="flex flex-col items-center">
      {/* <h1>Trips</h1> */}
      <article className="grid w-full grid-cols-2 gap-4 p-4 my-6 md:gap-12 md:grid-cols-3 lg:w-2/3">
        {trips.map((trip, i) => (
          <TripCard cardNumber={i} trip={trip} key={trip._id} />
        ))}
      </article>
    </div>
  );
}
