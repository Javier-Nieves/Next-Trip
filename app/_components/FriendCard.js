import Link from 'next/link';
import Button from './Button';
import {
  FaRegTimesCircle,
  FaRegCheckCircle,
  FaRegTrashAlt,
} from 'react-icons/fa';
// import { addFriend } from '../_lib/actions';

function FriendCard({ friend, type }) {
  // type can be 'friend' or 'request'

  async function handleAddFriend() {
    // await addFriend(friend._id);
    console.log('\x1b[36m%s\x1b[0m', 'handler');
  }

  return (
    <Link href={`/collections/${String(friend._id)}`}>
      <li
        className={`relative flex items-center w-3/4 p-2 mx-auto border rounded-md shadow-md lg:w-4/5 border-stone-500 transition-all duration-300 hover:cursor-pointer hover:scale-[1.01] ${type === 'request' ? 'justify-between' : 'justify-center'}`}
      >
        {type === 'request' && (
          <div
            className="mx-4 text-4xl text-red-500 hover:text-red-700"
            // onClick={handleAddFriend}
          >
            <button type="submit">
              <FaRegTimesCircle />
            </button>
          </div>
        )}

        <span className="flex items-center">
          <img
            src={friend.photo}
            alt={friend.name}
            className="mr-2 overflow-hidden border-4 border-white rounded-full w-14 aspect-square"
          />
          <div>{friend.name}</div>
        </span>
        {type === 'friend' && (
          <Button
            type="smallDelete"
            className="absolute bottom-0 right-0 m-1 rounded-md"
          >
            <FaRegTrashAlt />
          </Button>
        )}
        {type === 'request' && (
          <div className="mx-4 text-4xl text-green-500 hover:text-green-700">
            <FaRegCheckCircle />
          </div>
        )}
      </li>
    </Link>
  );
}

export default FriendCard;
