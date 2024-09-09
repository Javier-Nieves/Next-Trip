import { getUserInfo, getUserTrips } from '@/app/_lib/data-service';
import Button from '@/app/_components/Button';
import TripCard from '@/app/_components/TripCard';
import { UserInfo, TripDocument, UserDocument } from '@/app/_lib/types';

export async function generateMetadata({ params }) {
  let name: string;
  let isMe: boolean;
  const userInfo: UserInfo | void = await getUserInfo(params.userId);
  if (userInfo) ({ name, isMe } = userInfo);
  return { title: isMe ? 'My trips' : `Trips of ${name}` };
}

export default async function Page({ params }): Promise<JSX.Element> {
  // collection === all trips of one user
  // show public if you're not friends, show all is you are of it's your page
  // const { userData, isLoading } = useTraveler
  let user: UserDocument | null;
  let myId: string;
  let isMe: boolean;
  let isFriend: boolean;
  let friends: string[];
  const userInfo: UserInfo | void = await getUserInfo(params.userId);
  if (userInfo) ({ user, myId, isMe, isFriend, friends } = userInfo);

  const trustedIds = friends.map((friend) => friend.toString());
  trustedIds.push(params.userId);

  const trips: TripDocument[] | void = await getUserTrips(
    params.userId,
    trustedIds.includes(myId),
  );
  if (!trips) return;
  const columns: number = trips.length > 2 ? 3 : trips.length;

  return (
    <div className="flex flex-col items-center justify-center pb-8">
      <h1 className="text-4xl">
        {isMe ? 'My trips' : `Trips of ${user.name}`}
      </h1>

      <div className="flex items-center gap-2 pt-2">
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
