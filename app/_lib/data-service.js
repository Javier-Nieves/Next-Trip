import connectToDatabase from './mongoose';

import Trip from '../models/tripModel';

export async function getPublicTrips() {
  await connectToDatabase();
  const trips = await Trip.find({ private: false }).sort({ createdAt: 1 });

  return trips;
}

export async function getUser(email) {}

export async function createUser(data) {}
