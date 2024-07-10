import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MultiImageDropzoneUsage } from './MultiImageDropzoneUsage';
import { createLocation } from '@/app/_lib/actions';

function NewLocationForm({
  isHike,
  setNewLocationCoordinates,
  coordinates,
  setLocations,
}) {
  const { register, handleSubmit } = useForm();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data) {
    try {
      // adding controlled field 'images' into the form data
      // setValue('images', uploadedImages);
      const { name, address, description } = data;
      const fullData = {
        coordinates,
        name,
        address,
        description,
        images: uploadedImages,
        isHike,
      };
      // console.log('updated data:', fullData);
      const newLocation = await createLocation(fullData);
      // console.log('\x1b[34m%s\x1b[0m', 'success', newLocation);
      setLocations((cur) => [...cur, newLocation]);
      setNewLocationCoordinates([]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="absolute z-50 w-[450px] mx-10 flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-4 p-4 bg-[var(--color-light-yellow)] rounded-lg relative"
      >
        <button
          onClick={() => setNewLocationCoordinates([])}
          className="absolute top-3 right-3"
        >
          &#10005;
        </button>

        <h2 className="text-2xl font-semibold">Create new location</h2>

        <div className="grid grid-cols-[110px,1fr] w-full text-lg">
          <span className="my-auto">Name: </span>
          <input
            type="text"
            className="p-2 rounded-md"
            required
            {...register('name', { required: 'This field is required' })}
          />
        </div>

        <div className="grid grid-cols-[110px,1fr] w-full text-lg">
          <span className="my-auto">Address: </span>
          <input
            type="text"
            className="p-2 rounded-md text-md"
            {...register('address')}
          />
        </div>

        <div className="grid grid-cols-[110px,1fr] w-full text-lg">
          <span className="my-auto">Description: </span>
          <textarea
            type="text"
            className="h-24 p-2 rounded-md text-md"
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-[110px,1fr] w-full text-lg">
          <span className="my-auto">Images: </span>
          <MultiImageDropzoneUsage
            maxFiles={6}
            setUploadedImages={setUploadedImages}
            setIsLoading={setIsLoading}
          />
        </div>

        <button
          disabled={isLoading}
          className={`${isLoading ? 'bg-stone-500' : 'bg-[var(--color-accent-base)]'} ${!isLoading ? 'hover:bg-[var(--color-accent-dark)]' : ''} p-2 mt-2 rounded-md text-lg`}
        >
          {isLoading ? 'Loading...' : 'Create'}
        </button>
      </form>
    </div>
  );
}

export default NewLocationForm;
