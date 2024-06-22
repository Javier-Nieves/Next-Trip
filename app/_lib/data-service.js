import connectToDatabase from './mongoose';

import Trip from '../models/tripModel';

export async function getAllTrips() {
  await connectToDatabase();
  const trips = await Trip.find({});
  console.log('API');
  return trips;
}
