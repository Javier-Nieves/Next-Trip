import TripCard from '@/app/_components/TripCard';
import { getUserName } from '@/app/_lib/data-service';

// export const metadata = {
//   title: 'Hello',
// };

export default async function Page({ params }) {
  // collection === all trips of one user
  // todo - show public if you're not friends

  const res = await fetch(
    `${process.env.SITE_URL}/api/collections/${params.userId}`
  );
  const trips = await res.json();

  const { name, isMe, isFriend } = await getUserName(params.userId);

  return (
    <div className="flex flex-col m-auto">
      <h1>{isMe ? 'My trips' : `Trips of ${name}`}</h1>
      <h1>{!isMe ? (isFriend ? 'Your friend!' : 'Just a bloke') : ''}</h1>
      <article className="grid grid-cols-3 gap-8 w-full">
        {trips.data.map((trip) => (
          <TripCard trip={trip} key={trip._id} />
        ))}
      </article>
    </div>
  );
}
