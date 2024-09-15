import { getFriendsInfo } from '@/app/_lib/data-service';
import type { NextApiRequest } from 'next';

export const dynamic = 'force-dynamic';

// route is used in 'Add' and 'Friends' pages
export async function GET(req: NextApiRequest) {
  const data = await getFriendsInfo();

  return Response.json({ status: 'success', data });
}
