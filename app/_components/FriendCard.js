function FriendCard({ friend }) {
  console.log(friend.photo);
  return (
    <li className="flex items-center justify-center w-1/2 mx-auto border border-stone-500 shadow-md rounded-md p-2">
      <div className="w-14 aspect-square rounded-full overflow-hidden border-4 border-white mr-2">
        <img src={friend.photo} alt={friend.name} className="w-full h-full" />
      </div>
      <div>{friend.name}</div>
    </li>
  );
}

export default FriendCard;
