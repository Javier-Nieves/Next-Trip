import connectToDatabase from './mongoose';

// all Models should be initilized for DB find() method to work
import { auth } from './auth';
import Trip from '../models/tripModel';
import User from '../models/userModel';
import Location from '../models/locationModel';
import { TripDocument, UserDocument, Session } from '@/app/_lib/types';

export async function getPublicTrips(): Promise<TripDocument[]> {
  // get session and connect to the DB
  await connectToDatabase();
  const session: Session = await auth();

  console.log('\x1b[36m%s\x1b[0m', 'session', session);

  // Define user and trips
  let user: UserDocument | null = null;
  let trips: TripDocument[] = [];

  if (session?.user.id) {
    user = await User.findById(session.user.id);
  }

  // if user is authenticated - show all public trips and private trips of user's friends
  if (!user) {
    trips = await Trip.find({ private: false }).sort({ createdAt: -1 }).exec();
  } else {
    trips = await Trip.find({
      $or: [
        { private: false },
        { createdBy: { $in: user.friends } },
        { createdBy: session.user.id },
      ],
    })
      .sort({ createdAt: -1 })
      .exec();
  }

  return trips;
}

// export async function getPublicTrips() {
//   // get session and connect to the DB
//   const [session] = await Promise.all([auth(), connectToDatabase()]);
//   const user = await User.findById(session?.user.id);
//   console.log('\x1b[36m%s\x1b[0m', 'session', session);
//   // if user is authenticated - show all public trips and private trips of user's friends
//   let trips = [];
//   if (!user)
//     trips = await Trip.find({ private: false }).sort({ createdAt: -1 });
//   else {
//     trips = await Trip.find({
//       $or: [
//         { private: false },
//         { createdBy: { $in: user.friends } },
//         { createdBy: session.user.id },
//       ],
//     }).sort({ createdAt: -1 });
//   }

//   return trips;
// }

export async function getUserTrips(userId, showPrivateTrips = false) {
  try {
    await connectToDatabase();
    // find all trip where User was a traveler or creator
    let trips;
    if (showPrivateTrips)
      trips = await Trip.find({
        $or: [{ travelers: userId }, { createdBy: userId }],
      }).sort({
        createdAt: 1,
      });
    else
      trips = await Trip.find({
        private: false,
        $or: [{ travelers: userId }, { createdBy: userId }],
      }).sort({
        createdAt: 1,
      });
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
}

export async function getUserInfo(id) {
  try {
    await connectToDatabase();
    const [session, user] = await Promise.all([auth(), User.findById(id)]);
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
    const user = await User.findById(session.user.id)
      .populate('friends')
      .populate('friendRequests')
      .exec();
    return { user, userId: session.user.id };
  } catch (err) {
    console.error(err.message);
    throw new Error(`Friends can not be found for the user. ${err.message}`);
  }
}

export async function getTripInfo(tripId) {
  try {
    await connectToDatabase();
    const session = await auth();
    const trip = await Trip.findById(tripId);

    let travelersArray = [];
    if (trip.travelers) {
      let promiseArray = [];
      for (let i = 0; i < 3; i++) {
        if (trip.travelers.at(i))
          promiseArray.push(getUserInfo(trip.travelers.at(i)));
      }
      const travelersInfo = await Promise.all(promiseArray);
      travelersArray = travelersInfo.map((user) => {
        return {
          name: user.user.name,
          photo: user.user.photo,
          id: user.user._id,
        };
      });
    } else {
      // trip creator if no travelers are listed
      const { user } = await getUserInfo(trip.createdBy);
      travelersArray.push({ name: user.name, photo: user.photo, id: user._id });
    }
    return {
      trip,
      travelersArray,
      isMyTrip: session?.user?.id === trip?.createdBy,
    };
  } catch (err) {
    console.error('trip info error: ', err.message);
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
