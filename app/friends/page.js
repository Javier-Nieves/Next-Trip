'use client';

import { useFriends } from './useFriends';
import Spinner from '@/app/_components/Spinner';
import FriendCard from '@/app/_components/FriendCard';

export default function Page() {
  const { user, isLoading } = useFriends();

  const friendColumns = user?.friends.length > 8 ? 2 : 1;
  const requestsColumns = user?.friendRequests.length > 8 ? 2 : 1;

  if (isLoading) return <Spinner />;

  return (
    <section className="flex gap-4">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="p-4 text-3xl">My friends</h1>
        {user?.friends.length ? (
          <ul className={`grid w-full gap-3 lg:grid-cols-${friendColumns}`}>
            {user?.friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} type="friend" />
            ))}
          </ul>
        ) : (
          <h1>You have no friends yet</h1>
        )}
      </div>

      {user?.friendRequests.length && (
        <div className="flex flex-col items-center justify-center w-3/4 h-full">
          <h1 className="p-4 text-3xl">Friend requests</h1>
          <ul className={`grid w-full gap-3 lg:grid-cols-${requestsColumns}`}>
            {user?.friendRequests.map((person) => (
              <FriendCard key={person._id} friend={person} type="request" />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
