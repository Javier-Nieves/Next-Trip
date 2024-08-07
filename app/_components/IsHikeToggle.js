import { FaCar, FaWalking } from 'react-icons/fa';

function IsHikeToggle({ isHike, setIsHike }) {
  return (
    <div className="relative flex flex-col">
      <div className="flex items-center p-2 space-x-2 rounded-md backdrop-blur-sm">
        <span
          className={`text-2xl font-medium ${isHike ? 'text-black' : 'text-gray-500'}`}
        >
          <FaWalking />
        </span>
        <div
          className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300 ${isHike ? 'bg-[var(--color-orange)]' : 'bg-[var(--color-yellow)]'}`}
          onClick={() => {
            // console.log('clicked', Date.now(), isHike);
            setIsHike((cur) => !cur);
          }}
        >
          <span
            className={`absolute left-1 inline-block h-4 w-4 bg-black rounded-full transform transition-transform duration-300 ${isHike ? 'translate-x-0' : 'translate-x-6'}`}
          ></span>
        </div>
        <span
          className={`text-2xl font-medium ${isHike ? 'text-gray-500' : 'text-black'}`}
        >
          <FaCar />
        </span>
      </div>
      {isHike && (
        <span className="absolute text-red-700 top-9 left-4 text-[12px]">
          Distanse &lt; 100 km
        </span>
      )}
    </div>
  );
}

export default IsHikeToggle;
