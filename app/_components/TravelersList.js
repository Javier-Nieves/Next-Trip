function TravelersList({ travelers, handleRemoveTraveler }) {
  return (
    <ul className="flex">
      {travelers?.map((traveler) => (
        <li
          onClick={() => handleRemoveTraveler(traveler)}
          key={traveler._id}
          className="relative flex items-center p-2 mx-4 my-2 border border-r rounded-lg shadow-md border-primary-800 hover:cursor-pointer group border-stone-400"
        >
          <img
            src={traveler.photo}
            alt={traveler.name}
            className="w-10 h-10 mr-2 border-2 border-white rounded-full"
          />
          <span className="font-medium">{traveler.name}</span>
          <div className="absolute flex items-center justify-center text-white transition-opacity duration-300 bg-red-500 rounded-full opacity-0 w-7 aspect-square focus:outline-none left-1/2 group-hover:opacity-100">
            &times;
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TravelersList;
