import { getFriendsInfo } from '@/app/_lib/data-service';

// route is used in 'Add' and 'Friends' pages
export async function GET(request) {
  const data = await getFriendsInfo();

  return Response.json({ status: 'success', data });
}
