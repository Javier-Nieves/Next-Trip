import Image from 'next/image';
import { useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

function Backdrop({ children, onClick, photoFocused, photos }) {
  const [activePhoto, setActivePhoto] = useState(photos?.indexOf(photoFocused));

  const handleCloseInfo = (event) => {
    // to close new location form when user clicked outside of the form
    if (event.target === event.currentTarget) {
      onClick();
    }
  };

  const handleInc = () => {
    if (activePhoto + 1 < photos.length) {
      setActivePhoto((cur) => cur + 1);
    } else setActivePhoto(0);
  };
  const handleDec = () => {
    if (activePhoto > 0) {
      setActivePhoto((cur) => cur - 1);
    } else setActivePhoto(photos.length - 1);
  };

  return (
    <div className="fixed top-0 left-0  w-screen h-screen mx-auto bg-slate-700/70 z-[100] backdrop-blur-[2px]">
      <div
        className="flex items-center justify-center h-full gap-4"
        onClick={handleCloseInfo}
      >
        {(activePhoto || activePhoto === 0) && (
          <>
            <div
              className="text-4xl text-white transition-all duration-300 hover:scale-[1.1] hover:cursor-pointer"
              onClick={handleDec}
            >
              <FaAngleLeft />
            </div>

            <div
              className="relative w-4/5 min-h-[75%] max-h-[90%]"
              onClick={onClick}
            >
              <Image
                src={photos.at(activePhoto)}
                alt="Selected location Image"
                fill
                placeholder="blur"
                blurDataURL={`/_next/image?url=${photos.at(activePhoto)}&w=16&q=1`}
                className="absolute inset-0 object-contain h-full"
              />
            </div>

            <div
              className="text-4xl text-white transition-all duration-300 hover:scale-[1.1] hover:cursor-pointer"
              onClick={handleInc}
            >
              <FaAngleRight />
            </div>
          </>
        )}
        {!photoFocused && photoFocused !== 0 && children}
      </div>
    </div>
  );
}

export default Backdrop;
