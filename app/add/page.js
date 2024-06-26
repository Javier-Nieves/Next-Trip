'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEdgeStore } from '../_lib/edgestore';

import { differenceInDays } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import Button from '../_components/Button';
import Progress from '../_components/Progress';

export default function Page() {
  const initialRange = { from: undefined, to: undefined };
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [range, setRange] = useState(initialRange);
  const { edgestore } = useEdgeStore();

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {},
  });
  //   const { errors } = formState;

  const duration = differenceInDays(range.to, range.from) + 1;

  async function onSubmit(data) {
    // adding controlled field Country into the form data
    // setValue('duration', duration);
    let coverImage = '/public/default-trip.jpeg';

    if (data.coverImage.length) {
      // uploading coverImage to EdgeStore
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setProgress(progress);
          console.log('progress', progress);
        },
      });
      console.log(res);
      coverImage = res.url;
    }

    const completeData = {
      ...data,
      duration,
      date: range.from,
      coverImage,
      createdAt: new Date(),
    };
    console.log(completeData);
    // clear form
    reset();
    setFile(null);
    setRange(initialRange);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center flex-col items-center my-3 w-1/2 mx-auto"
    >
      <h1>Create trip</h1>
      <Progress progress={progress} />
      <input
        className="px-5 py-3 w-3/4 shadow-sm rounded-sm m-3"
        type="text"
        placeholder="Name"
        id="name"
        // disabled={isWorking}
        {...register('name', { required: 'This field is required' })}
      />
      <input
        className="px-5 py-3 w-3/4 shadow-sm rounded-sm m-3"
        type="text"
        placeholder="Best thing about this trip"
        id="highlight"
        // disabled={isWorking}
        {...register('highlight')}
      />
      <DayPicker
        className="pt-3 place-self-center"
        mode="range"
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
// todo  travelers: [ [Object], [Object] ],
// todo  description: 'test',
// todo  createdBy: '66795378a059a9fb42c4ec22',
//   date: 2020-07-23T00:00:00.000Z,
//   highlight: 'Across all country in a car',
// todo  private: false,
//   duration: '3 weeks',
//   coverImage: 'trip-65444d163218278ffd2104f2-1699660062616.jpeg'
// }
