// import { useQuery } from '@tanstack/react-query';
// import { getUserInfo, getUserTrips } from '@/app/_lib/data-service';

// export async function useTraveler(id) {
//   const { data: userData, isLoading } = useQuery({
//     queryKey: ['user', id],
//     queryFn: async () => {
//       const { user, myId, isMe, isFriend, friends } = await getUserInfo(
//         params.userId,
//       );
//       const trustedIds = friends.map((friend) => friend.toString());
//       trustedIds.push(id);
//       const trips = await getUserTrips(
//         params.userId,
//         trustedIds.includes(myId),
//       );
//       return { user, myId, isMe, isFriend, friends, trips };
//     },
//   });
//   return { userData, isLoading };
// }
