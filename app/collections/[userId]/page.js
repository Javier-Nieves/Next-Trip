import { getUserInfo, getUserTrips } from '@/app/_lib/data-service';
import Button from '@/app/_components/Button';
import PhotoLink from '@/app/_components/PhotoLink';
import TripCard from '@/app/_components/TripCard';

export async function generateMetadata({ params }) {
  const { name, isMe } = await getUserInfo(params.userId);
  return { title: isMe ? 'My trips' : `Trips of ${name}` };
}

export default async function Page({ params }) {
  // collection === all trips of one user
  // show public if you're not friends, show all is you are of it's your page
  // const { userData, isLoading } = useTraveler
  const { user, myId, isMe, isFriend, friends } = await getUserInfo(
    params.userId,
  );
  const trustedIds = friends.map((friend) => friend.toString());
  trustedIds.push(params.userId);

  const trips = await getUserTrips(params.userId, trustedIds.includes(myId));
  const columns = trips.length > 3 ? 4 : trips.length;

  return (
    <div className="flex flex-col items-center justify-center pb-8">
      <h1 className="text-4xl">
        {isMe ? 'My trips' : `Trips of ${user.name}`}
      </h1>

      {/* <h1>{!isMe ? (isFriend ? 'Your friend!' : 'Just a bloke') : ''}</h1> */}
      <div className="flex items-center gap-2 pt-2">
        {/* <PhotoLink travelersArray={[user]} type="desc" /> */}
        {!isMe && !isFriend && <Button type="small">Add friend</Button>}
        {!isMe && isFriend && <Button type="smallDelete">Remove friend</Button>}
      </div>

      <article
        className={`grid w-full grid-cols-${columns} gap-8 mt-4 lg:w-3/4`}
      >
        {trips.map((trip) => (
          <TripCard trip={trip} key={trip._id} />
        ))}
      </article>
    </div>
  );
}
