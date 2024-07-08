import { MultiImageDropzoneUsage } from './MultiImageDropzoneUsage';

function NewLocationForm({ setCreatingLocation }) {
  return (
    <div className="absolute z-50 w-[450px] h-3/4 left-10 bg-[var(--color-light-yellow)] rounded-lg translate-y-[100px]">
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <button
          onClick={() => setLocationInfo(null)}
          className="absolute top-3 right-3"
        >
          &#10005;
        </button>

        <h2 className="text-2xl font-semibold">Create new location</h2>

        <div className="grid grid-cols-[110px,1fr] w-full text-lg">
          <span className="my-auto">Name: </span>
          <input type="text" required className="p-2 rounded-md" />
        </div>

        <div className="grid grid-cols-[110px,1fr] w-full text-lg">
          <span className="my-auto">Address: </span>
          <input type="text" className="p-2 rounded-md text-md" />
        </div>

        <div className="grid grid-cols-[110px,1fr] w-full text-lg">
          <span className="my-auto">Description: </span>
          <textarea type="text" className="h-24 p-2 rounded-md text-md" />
        </div>

        <div className="grid grid-cols-[110px,1fr] w-full text-lg">
          <span className="my-auto">Images: </span>
          <MultiImageDropzoneUsage />
        </div>

        <button className="bg-[var(--color-accent-base)] hover:bg-[var(--color-accent-dark)] p-2 mt-2 rounded-md text-lg">
          Create
        </button>
      </div>
    </div>
  );
}

export default NewLocationForm;
