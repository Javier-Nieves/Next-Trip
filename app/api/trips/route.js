export async function GET(request) {
  const geoKey = process.env.GEO_API_KEY;
  return Response.json({ status: 'success', geoKey });
}
