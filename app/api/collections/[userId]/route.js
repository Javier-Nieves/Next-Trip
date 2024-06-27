// import { getFriendsInfo, getUserTrips } from '@/app/_lib/data-service';

// export async function GET(request, { params }) {
//   console.log('GETing');
//   const { friends, userId } = await getFriendsInfo();

//   console.log('\x1b[35m%s\x1b[0m', 'friends!', friends);
//   // show private trips only to friends and owner
//   const trustedIds = friends.map((friend) => friend.id).push(userId);
//   console.log('\x1b[35m%s\x1b[0m', 'IDs!', trustedIds);

//   const data = await getUserTrips(params.userId);
//   console.log('data', data);

//   return Response.json({ status: 'success', data });
// }
