import TripCard from './_components/TripCard';

// export const metadata = {
//   title: 'Hello',
// };

export default async function Page() {
  // index page renders all public trips when user isn't logged in
  const res = await fetch(`${process.env.SITE_URL}/api/collections`);
  const trips = await res.json();
  // console.log(trips);

  return (
    <div className="flex flex-col m-auto">
      <h1>Trips</h1>
      <article className="grid grid-cols-3 gap-8 w-full">
        {trips.data.map((trip) => (
          <TripCard trip={trip} key={trip._id} />
        ))}
      </article>
    </div>
  );
}
