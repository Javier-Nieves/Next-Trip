function IsHikeToggle({ isHike, setIsHike }) {
  return (
    <div className="flex items-center mt-2 space-x-2">
      <span
        className={`text-xl font-medium ${isHike ? 'text-black' : 'text-gray-500'}`}
      >
        Hike
      </span>
      <div
        className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300 ${isHike ? 'bg-[var(--color-accent-base)]' : 'bg-[var(--color-yellow)]'}`}
        onClick={() => setIsHike((cur) => !cur)}
      >
        <span
          className={`absolute left-1 inline-block h-4 w-4 bg-black rounded-full transform transition-transform duration-300 ${isHike ? 'translate-x-0' : 'translate-x-6'}`}
        ></span>
      </div>
      <span
        className={`text-xl font-medium ${isHike ? 'text-gray-500' : 'text-black'}`}
      >
        Drive
      </span>
    </div>
  );
}

export default IsHikeToggle;
