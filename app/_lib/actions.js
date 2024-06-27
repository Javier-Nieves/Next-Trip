'use server';

import Trip from '../models/tripModel';
import User from '../models/userModel';

import connectToDatabase from './mongoose';
import { handlers, auth, signIn, signOut } from './auth';

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
  const filteredBody = filterBody(data, 'name', 'date', 'travelers', 'duration',
    'highlight', 'description', 'private', 'coverImage', 'createdAt', 'createdBy' );

  const newTrip = await Trip.create(filteredBody);
  console.log(newTrip);
  // return { status: 'success', data: { newTrip } };
  // redirect('/');
}

function filterBody(obj, ...allowedFields) {
  // clear all unwanted fields from an object. For security
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}
