import connectToDatabase from './mongoose';

// all Models should be initilized for DB find() method to work
import { auth } from './auth';
import Trip from '../models/tripModel';
import User from '../models/userModel';
import Location from '../models/locationModel';
import {
  TripDocument,
  UserDocument,
  Session,
  UserInfo,
  TripInfo,
} from '@/app/_lib/types';

export async function getPublicTrips(): Promise<TripDocument[]> {
  // get session and connect to the DB
  await connectToDatabase();
  const session: Session | null = await auth();
  // console.log('\x1b[36m%s\x1b[0m', 'session', session);

  // define user and trips
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

export async function getUserTrips(
  userId: string,
  showPrivateTrips: boolean = false,
): Promise<TripDocument[] | void> {
  try {
    await connectToDatabase();
    // find all trip where User was a traveler or creator
    let trips: TripDocument[] = [];
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

export async function getUserInfo(id: string): Promise<UserInfo | void> {
  try {
    await connectToDatabase();
    const [session, user]: [Session | null, UserDocument | null] =
      await Promise.all([auth(), User.findById(id).exec()]);

    if (!user || !session) return;

    return {
      user,
      name: user.name,
      photo: user.photo,
      isMe: user._id.toString() === session.user.id,
      isFriend: user.friends.includes(session.user.id),
      friends: user.friends,
      myId: session.user.id,
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

export async function getTripInfo(tripId: string): Promise<TripInfo | void> {
  try {
    await connectToDatabase();
    const session: Session | null = await auth();
    const trip: TripDocument | null = await Trip.findById(tripId).exec();

    if (!trip || !session) return;

    let travelersArray: { name: string; photo?: string; id: string }[] = [];

    // todo - populate??
    if (trip.travelers) {
      let promiseArray: Promise<UserInfo | void>[] = [];
      for (let i = 0; i < 3; i++) {
        if (trip.travelers.at(i)) {
          const travelerId = trip.travelers.at(i);
          if (travelerId) {
            promiseArray.push(getUserInfo(travelerId));
          }
        }
      }

      const travelersInfo = await Promise.all(promiseArray);
      // + type guard to filter out void results
      travelersArray = travelersInfo
        .filter(
          (userInfo): userInfo is UserInfo => !!userInfo && !!userInfo.user,
        )
        .map((user) => {
          return {
            name: user.user.name,
            photo: user.user.photo,
            id: user.user._id,
          };
        });
    } else {
      // if no travelers are listed, show the trip creator
      const userInfo = await getUserInfo(trip.createdBy);
      if (userInfo) {
        const { user } = userInfo;
        travelersArray.push({
          name: user.name,
          photo: user.photo,
          id: user._id,
        });
      } else {
        console.error('Failed to fetch user information');
      }
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
