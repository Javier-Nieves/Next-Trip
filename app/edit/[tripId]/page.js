'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { add } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { differenceInDays } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { editTrip } from '@/app/_lib/actions';
import { MultiImageDropzoneUsage } from '@/app/_components/MultiImageDropzoneUsage';
import SmallToggle from '@/app/_components/SmallToggle';
import Button from '@/app/_components/Button';
import TravelersList from '@/app/_components/TravelersList';

import 'react-day-picker/dist/style.css';
import { useTrip } from '@/app/trips/[tripId]/useTrip';
import Link from 'next/link';

export default function Page({ params }) {
  // todo - only creator can access this page
  const { trip, isLoading: tripLoading } = useTrip(params.tripId);
  // todo - useReducer useRef?
  const initialRange = { from: undefined, to: undefined };
  const [range, setRange] = useState(initialRange);
  const [inputValue, setInputValue] = useState('');
  const [selectedTravelers, setSelectedTravelers] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);

  const userId = useRef(null);
  const travelers = useRef(null);
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {},
  });

  const duration = range?.to
    ? +differenceInDays(range?.to, range?.from) + 1
    : 0;

  // getting friends info to populate travelers selector and add userId to Trip object
  useEffect(function () {
    async function getFriends() {
      const res = await fetch(`/api/friends`);
      const data = await res.json();
      userId.current = data.data.userId;
      travelers.current = [...data.data.friends, data.data.user];
      // setSelectedTravelers([data.data.user]);
      document.querySelector('.mainTitle').innerHTML = 'Edit Trip';
    }
    getFriends();
  }, []);

  // check phone or web (to set 1 or 2 month calendar)
  useEffect(
    function () {
      setIsWideScreen(window.screen.width > 660);
    },
    [isWideScreen],
  );

  // fill selectedTravelers
  useEffect(
    function () {
      setSelectedTravelers(trip?.travelers);
      setRange({
        from: trip?.date,
        to: add(trip?.date, { days: trip?.duration }),
      });
      setIsLoading(tripLoading);
    },
    [trip],
  );

  async function onSubmit(data) {
    try {
      let coverImage = uploadedImages.at(0) || trip.coverImage;
      const completeData = {
        ...data,
        id: trip._id,
        travelers: selectedTravelers.map((traveler) => traveler._id),
        date: range.from,
        duration,
        coverImage,
      };
      console.log('new info', completeData);
      await editTrip(completeData);
      toast.success('🏞️ Trip info is edited!');
      // clear form
      reset();
      setRange(initialRange);
      setSelectedTravelers([]);
    } catch (err) {
      toast.error(err.message);
    }
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
      <div className="flex items-center">
        <div className="w-3/4">
          <input
            className="px-5 py-3 w-[90%] shadow-md rounded-xl m-2"
            type="text"
            placeholder="Name"
            defaultValue={trip?.name}
            id="name"
            disabled={isLoading}
            {...register('name', { required: 'This field is required' })}
          />

          <input
            className="px-5 py-3 w-[90%] shadow-md rounded-xl m-2"
            type="text"
            placeholder="Best thing about this trip"
            id="highlight"
            defaultValue={trip?.highlight}
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
              {travelers.current?.map((friend) => (
                <option key={friend._id} value={friend.name} />
              ))}
            </datalist>
          </div>

          <SmallToggle register={register} checked={trip?.private}>
            Show only to friends:
          </SmallToggle>
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
        fromDate={new Date(1900, 0)}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={isWideScreen ? 2 : 1}
      />

      <div className="flex items-center gap-4">
        <Button
          disabled={isLoading}
          type="menu"
          className="bg-gray-400 rounded-lg"
        >
          <Link href={`/trips/${trip?._id}`}>
            <span className="flex items-center gap-1">
              <FaArrowLeft /> Back to the trip
            </span>
          </Link>
        </Button>

        <Button disabled={isLoading} type="bright">
          <FaSave /> Save
        </Button>
      </div>
    </form>
  );
}
