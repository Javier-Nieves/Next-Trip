'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { enGB } from 'date-fns/locale';
import { differenceInDays } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { createTrip } from '../_lib/actions';
import { MultiImageDropzoneUsage } from '../_components/MultiImageDropzoneUsage';
import SmallToggle from '../_components/SmallToggle';
import Button from '../_components/Button';
import TravelersList from '../_components/TravelersList';
import toast from 'react-hot-toast';

export default function Page() {
  // todo - useReducer useRef?
  const initialRange = { from: undefined, to: undefined };
  const [range, setRange] = useState(initialRange);
  const [inputValue, setInputValue] = useState('');
  const [selectedTravelers, setSelectedTravelers] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);

  const userId = useRef(null);
  const travelers = useRef([]);
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {},
  });
  //   const { errors } = formState;
  const duration = range?.to
    ? +differenceInDays(range?.to, range?.from) + 1
    : 0;

  // getting friends info to populate travelers selector and add userId to Trip object
  useEffect(function () {
    async function getFriends() {
      const res = await fetch(`/api/friends`);
      const data = await res.json();
      // console.log(data);
      userId.current = data.data.userId;
      travelers.current = [...data.data.friends, data.data.user];
      setSelectedTravelers([data.data.user]);
    }
    getFriends();
  }, []);

  // check phone or web
  useEffect(
    function () {
      setIsWideScreen(window.screen.width > 660);
    },
    [isWideScreen],
  );

  async function onSubmit(data) {
    let coverImage = uploadedImages.at(0) || '/default-trip.jpeg';
    const completeData = {
      ...data,
      createdBy: userId.current,
      travelers: selectedTravelers.map((traveler) => traveler._id),
      duration,
      date: range.from,
      coverImage,
      createdAt: new Date(),
    };
    // console.log('data', completeData);
    await createTrip(completeData);
    toast.success('🏞️ New trip is created!');
    // clear form
    reset();
    setRange(initialRange);
    setSelectedTravelers([]);
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    // Check if the input value matches any friend's name
    const selectedTraveler = travelers.current.find(
      (traveler) => traveler.name === event.target.value,
    );
    if (selectedTraveler) handleSelectTraveler(selectedTraveler);
  };

  const handleSelectTraveler = (traveler) => {
    // add traveler to the travelers list if they're not already there
    if (!selectedTravelers.some((selected) => selected._id === traveler._id)) {
      setSelectedTravelers([...selectedTravelers, traveler]);
    }
    setInputValue('');
  };

  const handleRemoveTraveler = (travelerToRemove) => {
    setSelectedTravelers(
      selectedTravelers.filter((traveler) => traveler !== travelerToRemove),
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center w-full mx-auto md:w-1/2"
    >
      <h1 className="p-1 text-4xl">Create trip</h1>
      <div className="flex items-center">
        <div className="w-3/4">
          <input
            className="px-5 py-3 w-[90%] shadow-md rounded-xl m-2"
            type="text"
            placeholder="Name"
            id="name"
            disabled={isLoading}
            {...register('name', { required: 'This field is required' })}
          />

          <input
            className="px-5 py-3 w-[90%] shadow-md rounded-xl m-2"
            type="text"
            placeholder="Best thing about this trip"
            id="highlight"
            disabled={isLoading}
            {...register('highlight')}
          />
        </div>
        <div className="w-1/4 pr-1 md:p-2">
          <MultiImageDropzoneUsage
            setUploadedImages={setUploadedImages}
            setIsLoading={setIsLoading}
            maxFiles={1}
          />
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <div className="flex justify-around w-full">
          <div>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="traveler-input">Travelers:</label>
              <input
                className="px-5 py-3 m-2 shadow-md rounded-xl"
                id="traveler-input"
                list="travelers-list"
                value={inputValue}
                onChange={handleInputChange}
              />
            </div>
            <datalist id="travelers-list">
              {travelers.current.map((friend) => (
                <option key={friend._id} value={friend.name} />
              ))}
            </datalist>
          </div>

          <SmallToggle register={register}>Friends only:</SmallToggle>
        </div>

        <div>
          <TravelersList
            travelers={selectedTravelers}
            handleRemoveTraveler={handleRemoveTraveler}
          />
        </div>
      </div>

      <DayPicker
        className="place-self-center"
        mode="range"
        locale={enGB}
        onSelect={setRange}
        selected={range}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={isWideScreen ? 2 : 1}
      />
      <Button disabled={isLoading}>Save</Button>
    </form>
  );
}

// {
//   _id: new ObjectId('652c74f6d5f82888a6b7aee8'),
//   name: 'Big Colombia Trip',
//   travelers: [ [Object], [Object] ],
// todo  description: 'test',
//   createdBy: '66795378a059a9fb42c4ec22',
//   date: 2020-07-23T00:00:00.000Z,
//   highlight: 'Across all country in a car',
//   private: false,
//   duration: '3 weeks',
//   coverImage: 'trip-65444d163218278ffd2104f2-1699660062616.jpeg'
// }
