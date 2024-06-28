function TravelersList({ travelers, handleRemoveTraveler }) {
  return (
    <ul className="flex">
      {travelers.map((traveler) => (
        <li
          onClick={() => handleRemoveTraveler(traveler)}
          key={traveler._id}
          className="flex items-center mx-4 my-2 p-2 border-r border-primary-800 hover:cursor-pointer relative group border border-stone-400 rounded-lg shadow-md"
        >
          <img
            src={traveler.photo}
            alt={traveler.name}
            className="w-10 h-10 rounded-full mr-2 border-2 border-white"
          />
          <span className="font-medium">{traveler.name}</span>
          <div className="flex items-center justify-center w-7 aspect-square rounded-full bg-red-500 text-white focus:outline-none transition-opacity duration-300 absolute left-1/2 opacity-0 group-hover:opacity-100">
            &times;
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TravelersList;
