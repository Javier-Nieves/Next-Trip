'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import Trip from '../models/tripModel';
import Location from '../models/locationModel';
import User from '../models/userModel';

import connectToDatabase from './mongoose';
import { handlers, auth, signIn, signOut } from './auth';

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

export async function editTrip(data) {
  const tripId = await getTripId();
  if (!tripId) throw new Error('Can not modify this!');

  await connectToDatabase();
  // prettier-ignore
  const filteredBody = filterData({...data}, 'name', 'date', 'travelers', 'duration',
    'highlight', 'description', 'private', 'coverImage');
  // console.log('\x1b[36m%s\x1b[0m', 'tripId', tripId);
  const modifiedTrip = await Trip.findByIdAndUpdate(tripId, filteredBody);
  revalidatePath(`/`);
  redirect(`/trips/${modifiedTrip._id}`);
}

export async function addLocationToTrip(data) {
  try {
    const tripId = await getTripId();
    const filteredData = filterData(
      data,
      'name',
      'address',
      'description',
      'coordinates',
      'isHike',
      'images',
    );
    const newLocation = await Location.create({
      ...filteredData,
      trip: tripId,
    });
    const modTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $push: { locations: newLocation.id }, isHike: filteredData.isHike },
      { new: true },
    );
    return JSON.parse(JSON.stringify(modTrip));
  } catch (err) {
    console.error(err);
    throw new Error(`Couldn't create new location. ${err.message}`);
  }
}

export async function deleteLocationFromTrip(name) {
  try {
    const tripId = await getTripId();
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

export async function deleteTrip() {
  try {
    const tripId = await getTripId();
    // console.log('API delete', tripId);
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

export async function addFriend(id) {
  console.log('\x1b[36m%s\x1b[0m', 'adding friend', id);
}

export async function navigate(url = '/') {
  redirect(url);
}

async function getTripId() {
  try {
    const headersList = headers();
    // read the custom x-url header to get tripId
    const header_url = headersList.get('x-url') || '';
    const tripId = header_url.split('/').at(-1);
    // check if trip is created by logged in user
    await connectToDatabase();
    const trip = await Trip.findById(tripId);
    const session = await auth();
    console.log('checking creation: ', trip?.createdBy, session.user.id);
    if (trip?.createdBy !== session.user.id) return;

    return tripId;
  } catch (err) {
    console.error('API error: ', err.message);
    toast.error(err.message);
  }
}

function filterData(obj, ...allowedFields) {
  // console.log('filtering', obj);
  // clear all unwanted fields from an object. For security
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}
