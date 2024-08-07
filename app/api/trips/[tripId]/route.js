import { getTripInfo } from '@/app/_lib/data-service';

// this route is used in the 'Trips' page

export async function GET(request, { params }) {
  const data = await getTripInfo(params.tripId);

  return Response.json({ status: 'success', data });
}
