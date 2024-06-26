import { getFriendsInfo } from '@/app/_lib/data-service';

export async function GET(request) {
  const data = await getFriendsInfo();

  return Response.json({ status: 'success', data });
}
