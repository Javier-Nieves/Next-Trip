'use server';

import Trip from '../models/tripModel';
import Location from '../models/locationModel';
import User from '../models/userModel';

import connectToDatabase from './mongoose';
import { handlers, auth, signIn, signOut } from './auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { format } from 'path';

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
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
  // console.log(newTrip);
  revalidatePath(`/`);
  redirect(`/trips/${newTrip._id}`);
}

export async function createLocation(data) {
  try {
    const headersList = headers();
    // read the custom x-url header to get tripId
    const header_url = headersList.get('x-url') || '';
    const tripId = header_url.split('/').at(-1);
    // check if trip is created by logged in user
    await connectToDatabase();
    const trip = await Trip.findById(tripId);
    const session = await auth();
    if (!trip.createdBy === session.user.id) return;

    const filteredData = filterData(
      data,
      'name',
      'address',
      'description',
      'coordinates',
      'isHike',
      'images',
    );
    const newLocation = await Location.create(filteredData);
    const modTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $push: { locations: newLocation.id }, isHike: filteredData.isHike },
      { new: true },
    );

    return JSON.parse(JSON.stringify(newLocation));
  } catch (err) {
    console.error(err);
    throw new Error(`Couldn't create new location. ${err.message}`);
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
