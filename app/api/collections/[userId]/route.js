import { getPublicTrips, getUserTrips } from '@/app/_lib/data-service';

export async function GET(request, { params }) {
  // console.log('\x1b[35m%s\x1b[0m', 'ID!', params);

  const data = await getUserTrips(params.userId);

  return Response.json({ status: 'success', data });
}
