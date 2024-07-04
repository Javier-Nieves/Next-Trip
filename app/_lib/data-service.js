import connectToDatabase from './mongoose';

// all Models should be initilized for DB find() method to work
import { auth } from './auth';
import Trip from '../models/tripModel';
import User from '../models/userModel';
import Location from '../models/locationModel';

export async function getPublicTrips() {
  try {
    await connectToDatabase();
    const trips = await Trip.find({ private: false }).sort({ createdAt: -1 });
    // console.log('trips', trips);
    return trips;
  } catch (err) {
    console.error(err.message);
  }
}

export async function getUserTrips(userId, showPrivateTrips = false) {
  try {
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
  } catch (err) {
    console.error(err.message);
  }
}

export async function getUser(email) {
  try {
    await connectToDatabase();
    const user = await User.find({ email });
    return user.at(0);
  } catch (err) {
    console.error(err.message);
  }
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
  try {
    await connectToDatabase();
    const user = await User.findById(id);
    const session = await auth();
    // console.log('getUserInfo', Boolean(session));
    return {
      user,
      name: user?.name,
      photo: user?.photo,
      isMe: user?._id.toString() === session?.user.id,
      myId: session?.user.id,
      isFriend: user?.friends.includes(session?.user.id),
      friends: user?.friends,
    };
  } catch (err) {
    console.error(err.message);
  }
}

export async function getFriendsInfo() {
  try {
    await connectToDatabase();
    const session = await auth();
    const user = await User.findById(session.user.id);
    // todo ? await User.findById(session.user.id).populate({ path: 'friends' });
    const friendIds = user.friends.map((user) => user.toString());
    const friends = await Promise.all(friendIds.map((id) => User.findById(id)));
    // console.log('friends', friends);
    return { user, userId: session.user.id, friends };
  } catch (err) {
    console.error(err.message);
  }
}

export async function getTripInfo(tripId) {
  try {
    await connectToDatabase();
    const session = await auth();
    const trip = await Trip.findById(tripId);
    return { trip, isMyTrip: session.user.id === trip.createdBy };
  } catch (err) {
    console.error(err.message);
  }
}

export async function createUser(newUser) {
  try {
    await connectToDatabase();
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
