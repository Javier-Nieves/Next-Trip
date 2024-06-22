import { getAllTrips } from '@/app/_lib/data-service';
import connectToDatabase from '@/app/_lib/mongoose';
import Trip from '@/app/models/tripModel';
import User from '@/app/models/userModel';
import Location from '@/app/models/locationModel';

export async function GET(request) {
  console.log('backend');
  const data = await getAllTrips();
  await connectToDatabase();
  //   const data = await Trip.find();
  //   const data = await User.find();
  //   const data = await Location.find();
  //   const data = 0;

  return Response.json({ status: 'success', data });
}
