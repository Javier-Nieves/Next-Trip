'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Trip from '../models/tripModel';
import Location from '../models/locationModel';
import User from '../models/userModel';
import connectToDatabase from './mongoose';
import { auth, signIn, signOut } from './auth';
import { FullLocationData } from '@/app/_lib/types';

export async function signInAction() {
  await signIn('google', { redirectTo: '/' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}

export async function createTrip(data) {
  await connectToDatabase();
  // only save fields are allowed:
  // prettier-ignore
  const filteredBody = filterData({...data}, 'name', 'date', 'travelers', 'duration',
    'highlight', 'description', 'private', 'coverImage', 'createdAt', 'createdBy', 'isHike' );

  const newTrip = await Trip.create(filteredBody);
  revalidatePath(`/`);
  //! Redirect doesn't work inside try-catch blocks
  redirect(`/trips/${newTrip._id}`);
}

export async function editTrip(tripId, data) {
  if (!tripId) throw new Error('Can not modify this!');

  await connectToDatabase();
  // prettier-ignore
  const filteredBody = filterData({...data}, 'name', 'date', 'travelers', 'duration',
    'highlight', 'description', 'private', 'coverImage');
  const modifiedTrip = await Trip.findByIdAndUpdate(tripId, filteredBody);
  revalidatePath(`/`);
  redirect(`/trips/${modifiedTrip._id}`);
}

export async function addLocationToTrip(
  data: FullLocationData,
  tripId: string,
) {
  try {
    const newLocation = await Location.create({
      ...data,
      trip: tripId,
    });
    const modTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $push: { locations: newLocation.id }, isHike: data.isHike },
      { new: true },
    );
    return JSON.parse(JSON.stringify(modTrip));
  } catch (err) {
    console.error('Actions error', err.message);
    throw new Error(`Couldn't create new location. ${err.message}`);
  }
}

export async function deleteLocationFromTrip(tripId, name) {
  try {
    const location = await Location.findOne({ trip: tripId, name });
    const imageUrls = location.images;
    // remove Location from the Trip
    await Trip.findByIdAndUpdate(
      tripId,
      { $pull: { locations: location._id } },
      { new: true },
    );
    // delete Location
    await Location.findByIdAndDelete(location._id);
    // send back URLs for deletion
    return JSON.parse(JSON.stringify(imageUrls));
  } catch (err) {
    console.error(err);
    throw new Error(`Couldn't delete location. ${err.message}`);
  }
}

export async function deleteTrip(tripId) {
  try {
    const trip = await Trip.findById(tripId);
    const locationsArray = trip.locations;
    const locationsToDelete = locationsArray.reduce(
      (acc, cur) => [...acc, cur._id],
      [],
    );
    const locationImages = locationsArray.reduce(
      (acc, cur) => [...acc, ...cur.images],
      [],
    );
    // add trip cover to delete it too. Exclude default picture.
    const imagesToDelete = [...locationImages, trip.coverImage].filter(
      (img) => img !== '/default-trip.jpeg',
    );
    const locDeletePromises = locationsToDelete.map((loc) =>
      Location.findByIdAndDelete(loc),
    );
    await Promise.all(locDeletePromises);
    await Trip.findByIdAndDelete(tripId);

    revalidatePath(`/`);
    // redirect('/');
    // send back URLs for deletion
    return JSON.parse(JSON.stringify(imagesToDelete));
  } catch (err) {
    console.error('trip deletion ', err);
    throw new Error(`Couldn't delete trip. ${err.message}`);
  }
}

export async function addFriend(id: string): Promise<void> {
  // console.log('\x1b[36m%s\x1b[0m', 'adding friend', id);
  try {
    await connectToDatabase();
    const session = await auth();
    const user = await User.findById(session.user.id);
    if (!user.friendRequests.includes(id) || user.friends.includes(id)) return;

    // mutual friendship adding:
    const userPromise = User.findByIdAndUpdate(
      session.user.id,
      {
        $addToSet: { friends: id }, // Add id to the friends array if it's not already present
        $pull: { friendRequests: id }, // Remove id from the friendRequests array
      },
      { new: true },
    );

    const newFriendPromise = await User.findByIdAndUpdate(id, {
      $addToSet: { friends: session.user.id },
    });

    await Promise.all([userPromise, newFriendPromise]);
    revalidatePath(`/`);
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function deleteFriend(id: string): Promise<void> {
  try {
    await connectToDatabase();
    const session = await auth();
    const user = await User.findById(session.user.id);
    if (!user.friends.includes(id)) return;

    // friend is put into friend requests category:
    const userPromise = User.findByIdAndUpdate(
      session.user.id,
      {
        $pull: { friends: id },
        $addToSet: { friendRequests: id },
      },
      { new: true },
    );

    // remove logged user user from friends
    const friendPromise = await User.findByIdAndUpdate(id, {
      $pull: { friends: session.user.id },
    });

    await Promise.all([userPromise, friendPromise]);
    revalidatePath(`/`);
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function declineRequest(id) {
  // console.log('\x1b[36m%s\x1b[0m', 'declining friend', id);
  try {
    await connectToDatabase();
    const session = await auth();
    const user = await User.findById(session.user.id);

    if (!user.friendRequests.includes(id)) return;
    await User.findByIdAndUpdate(
      session.user.id,
      {
        $pull: { friendRequests: id },
      },
      { new: true },
    );
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function navigate(url = '/') {
  redirect(url);
}

// todo - make CheckTripId
async function checkTripOrigin(tripId) {
  try {
    // check if trip is created by logged in user
    await connectToDatabase();
    const trip = await Trip.findById(tripId);
    const session = await auth();
    // console.log('checking creation: ', trip?.createdBy, session.user.id);
    if (trip?.createdBy !== session.user.id) return;

    return tripId;
  } catch (err) {
    console.error('API error: ', err.message);
    toast.error(err.message);
  }
}

// todo - DELETE:
function filterData(obj, ...allowedFields) {
  // console.log('filtering', obj);
  // clear all unwanted fields from an object. For security
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}
