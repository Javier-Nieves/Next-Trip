import Link from 'next/link';
import travelerImage from '../../public/user.png';
import { getUserInfo } from '../_lib/data-service';

async function PhotoLink({ trip, position, big }) {
  // display photo of the trip's creator of up to 3 photos of trip's travelers
  let travelersArray = [];
  if (trip.travelers) {
    let promiseArray = [];
    for (let i = 0; i < 3; i++) {
      if (trip.travelers.at(i))
        promiseArray.push(getUserInfo(trip.travelers.at(i)));
    }
    const travelersInfo = await Promise.all(promiseArray);
    travelersArray = travelersInfo.map((user) => {
      return {
        name: user.user.name,
        photo: user.user.photo,
        id: user.user._id,
      };
    });
  } else {
    // trip creator if no travelers are listed
    const { user } = await getUserInfo(trip.createdBy);
    travelersArray.push({ name: user.name, photo: user.photo, id: user._id });
  }

  return (
    <div className="absolute flex justify-center w-full gap-2 -translate-y-1/2">
      {travelersArray.map((traveler) => (
        <div
          className="relative flex flex-col items-center group"
          key={traveler.id}
        >
          <div
            className={` z-50 overflow-hidden duration-300 ease-in-out transform  border-4 border-white rounded-full ${big ? 'w-[4rem]' : 'w-[3.2rem]'} hover:cursor-pointer hover:scale-105 aspect-square`}
          >
            <Link href={`/collections/${traveler.id}`}>
              <img
                src={traveler.photo || travelerImage}
                alt="Traveler"
                className="object-cover w-full h-full"
              />
            </Link>
          </div>
          <div
            className={`absolute hidden items-center justify-center transition duration-300 opacity-0 group-hover:flex group-hover:opacity-100 ${big ? 'top-[3.8rem]' : 'top-[3rem]'} z-30`}
          >
            <div className="p-1 text-sm text-center bg-blue-100 rounded-md whitespace-nowrap">
              {traveler.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PhotoLink;
