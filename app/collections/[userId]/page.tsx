import { getUserInfo, getUserTrips } from '@/app/_lib/data-service';
import { FaBan } from 'react-icons/fa';
import Button from '@/app/_components/Button';
import TripCard from '@/app/_components/TripCard';
import { UserInfo, TripDocument, UserDocument } from '@/app/_lib/types';
import { sendRequest, cancelRequest, deleteFriend } from '@/app/_lib/actions';

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
  let isFriendRequest: boolean;
  let friends: string[];
  const userInfo: UserInfo | void = await getUserInfo(params.userId);
  if (userInfo)
    ({ user, myId, isMe, isFriend, isFriendRequest, friends } = userInfo);

  // creating a list of trusted users (friends) who will see user's private trips
  const trustedIds = friends.map((friend) => friend.toString());
  trustedIds.push(params.userId);

  const trips: TripDocument[] | void = await getUserTrips(
    params.userId,
    trustedIds.includes(myId),
  );
  if (!trips) return;
  const columns: number = trips.length > 2 ? 3 : trips.length;

  async function handleSendRequest() {
    'use server';
    await sendRequest(JSON.stringify(user._id));
  }
  async function handleCancelRequest() {
    'use server';
    await cancelRequest(user._id);
  }
  async function handleDeleteFriend() {
    'use server';
    await deleteFriend(user._id);
  }

  return (
    <div className="flex flex-col items-center justify-center pb-8">
      <h1 className="text-4xl">
        {isMe ? 'My trips' : `Trips of ${user.name}`}
      </h1>

      <div className="flex items-center gap-2 pt-2">
        {!isMe && !isFriend && !isFriendRequest && (
          <form action={handleSendRequest}>
            <Button type="small">Add friend</Button>
          </form>
        )}
        {!isMe && isFriendRequest && (
          <form
            action={handleCancelRequest}
            className="flex items-center gap-2"
          >
            <span>Friend request sent</span>
            <Button type="smallDelete">
              <FaBan />
            </Button>
          </form>
        )}
        {!isMe && isFriend && (
          <form action={handleDeleteFriend}>
            <Button type="smallDelete">Remove friend</Button>
          </form>
        )}
      </div>

      <article
        className={`grid w-full grid-cols-${columns} gap-8 mt-4 lg:w-3/4`}
      >
        {trips.map((trip) => (
          <TripCard trip={JSON.parse(JSON.stringify(trip))} key={trip._id} />
        ))}
      </article>
    </div>
  );
}
