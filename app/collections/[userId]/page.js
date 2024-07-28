import TripCard from '@/app/_components/TripCard';
import { getUserInfo, getUserTrips } from '@/app/_lib/data-service';

export async function generateMetadata({ params }) {
  const { name, isMe } = await getUserInfo(params.userId);
  return { title: isMe ? 'My trips' : `Trips of ${name}` };
}

export default async function Page({ params }) {
  // collection === all trips of one user
  // show public if you're not friends, show all is you are of it's your page
  const { name, myId, isMe, isFriend, friends } = await getUserInfo(
    params.userId,
  );
  const trustedIds = friends.map((friend) => friend.toString());
  trustedIds.push(params.userId);

  const trips = await getUserTrips(params.userId, trustedIds.includes(myId));

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl">{isMe ? 'My trips' : `Trips of ${name}`}</h1>
      <h1>{!isMe ? (isFriend ? 'Your friend!' : 'Just a bloke') : ''}</h1>
      <article className="grid w-full grid-cols-4 gap-8 mt-8 lg:w-3/4">
        {trips.map((trip) => (
          <TripCard trip={trip} key={trip._id} />
        ))}
      </article>
    </div>
  );
}
