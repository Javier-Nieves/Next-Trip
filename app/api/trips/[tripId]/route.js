import { getTripInfo } from '@/app/_lib/data-service';

// route is used in 'Trips' page
export async function GET(request, { params }) {
  const data = await getTripInfo(params.tripId);

  return Response.json({ status: 'success', data });
}
