'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { enGB } from 'date-fns/locale';
import { differenceInDays } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { useEdgeStore } from '../_lib/edgestore';
import Button from '../_components/Button';
import Progress from '../_components/Progress';
import TravelersList from '../_components/TravelersList';
import { createTrip } from '../_lib/actions';

export default function Page() {
  const initialRange = { from: undefined, to: undefined };
  const [range, setRange] = useState(initialRange);
  const [inputValue, setInputValue] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const userId = useRef(null);
  const travelers = useRef([]);
  const [selectedTravelers, setSelectedTravelers] = useState([]);
  const { edgestore } = useEdgeStore();
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {},
  });
  //   const { errors } = formState;
  const duration = +differenceInDays(range.to, range.from) + 1;

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

  async function onSubmit(data) {
    let coverImage = '/public/default-trip.jpeg';
    if (data.coverImage.length) {
      // uploading coverImage to EdgeStore
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => setProgress(progress),
      });
      coverImage = res.url;
    }

    const completeData = {
      ...data,
      createdBy: userId.current,
      travelers: selectedTravelers.map((traveler) => traveler._id),
      duration,
      date: range.from,
      coverImage,
      createdAt: new Date(),
    };
    console.log('data', completeData);
    await createTrip(completeData);
    // clear form
    reset();
    setFile(null);
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
      className="flex flex-col items-center justify-center w-1/2 mx-auto my-3"
    >
      <h1>Create trip</h1>
      <Progress progress={progress} />
      <div className="flex">
        <div className="w-3/4">
          <input
            className="px-5 py-3 w-[90%] shadow-md rounded-xl m-3"
            type="text"
            placeholder="Name"
            id="name"
            // disabled={isWorking}
            {...register('name', { required: 'This field is required' })}
          />

          <input
            className="px-5 py-3 w-[90%] shadow-md rounded-xl m-3"
            type="text"
            placeholder="Best thing about this trip"
            id="highlight"
            // disabled={isWorking}
            {...register('highlight')}
          />
        </div>
        <div className="flex items-center justify-center w-1/4">
          <label className="flex flex-col items-center gap-4 cursor-pointer justity-center">
            <span className="text-sm font-medium text-gray-900 ms-3 dark:text-gray-300">
              Friends only
            </span>
            <div>
              <input
                type="checkbox"
                className="sr-only peer"
                {...register('private')}
              />
              <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </div>
          </label>
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <div className="flex items-center justify-center w-full">
          <label htmlFor="traveler-input">Travelers:</label>
          <input
            className="px-5 py-3 m-3 shadow-md rounded-xl"
            id="traveler-input"
            list="travelers-list"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
        <datalist id="travelers-list">
          {travelers.current.map((friend) => (
            <option key={friend.id} value={friend.name} />
          ))}
        </datalist>

        <div>
          <TravelersList
            travelers={selectedTravelers}
            handleRemoveTraveler={handleRemoveTraveler}
          />
        </div>
      </div>

      <DayPicker
        className="pt-3 place-self-center"
        mode="range"
        locale={enGB}
        onSelect={setRange}
        selected={range}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
      />

      <div>
        <span>Cover image: </span>
        <input
          className="my-3"
          type="file"
          {...register('coverImage')}
          onChange={(e) => {
            setFile(e.target.files?.[0]);
          }}
        />
      </div>
      <Button className="border-1">Create trip</Button>
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
