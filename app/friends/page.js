import { getFriendsInfo } from '../_lib/data-service';

export const metadata = {
  title: 'My friends',
};

export default async function Page() {
  const { friends } = await getFriendsInfo();
  // console.log('\x1b[36m%s\x1b[0m', '12!', friends);
  return (
    <div className="flex flex-col m-auto">
      <h1>My friends</h1>
      {friends?.length ? (
        <article className="grid grid-cols-3 gap-8 w-full">
          {friends.map(
            (friend) =>
              // <TripCard trip={trip} key={trip._id} />
              friend.name
          )}
        </article>
      ) : (
        <h1>You have no friends yet</h1>
      )}
    </div>
  );
}
