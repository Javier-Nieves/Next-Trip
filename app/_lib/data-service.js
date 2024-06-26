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
  console.log('trips', trips);
  return trips;
}

export async function getUser(email) {
  await connectToDatabase();
  const user = await User.find({ email });
  return user.at(0);
  // {
  //   _id: new ObjectId('66795378a059a9fb42c4ec22'),
  //   name: 'Konstantin Nikolskiy',
  //   email: 'otro.konstantin@gmail.com',
  //   photo: 'default.jpg',
  //   role: 'user',
  //   friends: [ new ObjectId('65444d163218278ffd2104f2') ],
  //   friendRequests: [],
  //   active: true,
  // }
}

export async function getUserInfo(id) {
  await connectToDatabase();
  const user = await User.findById(id);
  const session = await auth();

  // console.log(user);

  return {
    name: user.name,
    isMe: user._id.toString() === session.user.id,
    isFriend: user.friends.includes(session.user.id),
    friends: user.friends,
  };
}

export async function getFriendsInfo() {
  await connectToDatabase();
  const session = await auth();
  const user = await User.findById(session.user.id);
  const friendIds = user.friends.map((user) => user.toString());
  const friends = await Promise.all(friendIds.map((id) => User.findById(id)));
  // console.log('friends', friends);
  return { user, userId: session.user.id, friends };
}

export async function createUser(newUser) {
  // console.log('creating ', newUser);
  await connectToDatabase();
  try {
    const data = await User.create({
      name: newUser.fullName,
      email: newUser.email,
      photo: newUser.photo,
    });
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('User could not be created');
  }
}
