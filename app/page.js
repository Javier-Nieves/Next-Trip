import TripCard from './_components/TripCard';

// export const metadata = {
//   title: 'Hello',
// };

export default async function Page() {
  // index page renders all public trips when user isn't logged in
  const res = await fetch(`${process.env.SITE_URL}/api/collections`);
  const trips = await res.json();
  // console.log('PAGE!!', trips.status);

  return (
    <div className="flex items-center flex-col">
      {/* <h1>Trips</h1> */}
      <article className="grid grid-cols-3 gap-12 w-2/3 my-6">
        {trips.data.map((trip, i) => (
          <TripCard cardNumber={i} trip={trip} key={trip._id} />
        ))}
      </article>
    </div>
  );
}
