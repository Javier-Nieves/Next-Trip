import { getFriendsInfo } from '../_lib/data-service';
import FriendCard from '@/app/_components/FriendCard';

export const metadata = {
  title: 'My friends',
};

export default async function Page() {
  const { friends } = await getFriendsInfo();
  // console.log('\x1b[36m%s\x1b[0m', '12!', friends);
  return (
    <div className="flex flex-col items-center h-full w-3/4 mx-auto">
      <h1>My friends</h1>
      {friends?.length ? (
        <ul className="grid gap-3 w-full">
          {friends.map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </ul>
      ) : (
        <h1>You have no friends yet</h1>
      )}
    </div>
  );
}
