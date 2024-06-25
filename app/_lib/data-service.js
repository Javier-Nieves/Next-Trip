import connectToDatabase from './mongoose';

// all Models should be initilized for DB find() method to work
import Trip from '../models/tripModel';
import User from '../models/userModel';
import { auth } from './auth';
// import Location from '../models/locationModel';

export async function getPublicTrips() {
  await connectToDatabase();
  const trips = await Trip.find({ private: false }).sort({ createdAt: 1 });
  // console.log('trips', trips);
  return trips;
}

export async function getUserTrips(userId, showPrivateTrips = false) {
  await connectToDatabase();
  // find all trip where User was a traveler
  const trips = await Trip.find({
    travelers: userId,
    private: showPrivateTrips,
  }).sort({
    createdAt: 1,
  });
  // console.log('trips', trips);
  return trips;
}

export async function getUser(email) {
  await connectToDatabase();
  const user = await User.find({ email });
  return user.at(0);
}

export async function getUserName(id) {
  await connectToDatabase();
  const user = await User.findById(id);
  const session = await auth();
  console.log();

  return {
    name: user.name,
    isMe: user._id.toString() === session.user.id,
    isFriend: user.friends.includes(session.user.id),
  };
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
