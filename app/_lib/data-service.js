import connectToDatabase from './mongoose';

import Trip from '../models/tripModel';
import User from '../models/userModel';

export async function getPublicTrips() {
  await connectToDatabase();
  const trips = await Trip.find({ private: false }).sort({ createdAt: 1 });

  return trips;
}

export async function getUser(email) {
  await connectToDatabase();
  const user = await User.find({ email });
  return user.at(0);
}

export async function createUser(newUser) {
  await connectToDatabase();
  try {
    const data = await User.create({
      name: newUser.fullName,
      email: newUser.email,
    });
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('User could not be created');
  }
}
