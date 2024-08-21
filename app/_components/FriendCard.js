import Link from 'next/link';
import Button from './Button';
import {
  FaRegTimesCircle,
  FaRegCheckCircle,
  FaRegTrashAlt,
} from 'react-icons/fa';
import { useAddFriend } from '@/app/friends/useAddFriend';
import { useDeleteFriend } from '@/app/friends/useDeleteFriend';
import { useDeclineRequest } from '@/app/friends/useDeclineRequest';

function FriendCard({ friend, type }) {
  // type can be 'friend' or 'request'
  const { addFriend, isLoading: isAdding } = useAddFriend();
  const { deleteFriend, isLoading: isDeleting } = useDeleteFriend();
  const { declineRequest, isLoading: isDeclining } = useDeclineRequest();
  const isWorking = isAdding || isDeclining || isDeleting;

  async function handleAddFriend(e) {
    e.preventDefault();
    addFriend(friend._id);
  }
  async function handleDecline(e) {
    e.preventDefault();
    declineRequest(friend._id);
  }
  async function handleDeleteFriend(e) {
    e.preventDefault();
    deleteFriend(friend._id);
  }

  return (
    <Link href={`/collections/${String(friend._id)}`}>
      <li
        className={`relative flex items-center w-1/2 p-2 mx-auto border rounded-md shadow-md border-stone-500 transition-all duration-300 hover:cursor-pointer hover:scale-[1.01] ${type === 'request' ? 'justify-between' : 'justify-center'}`}
      >
        {type === 'request' && (
          <div className="mx-4 text-4xl text-red-500 hover:text-red-700">
            <button onClick={handleDecline} disabled={isWorking}>
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
            disabled={isWorking}
            onClick={handleDeleteFriend}
          >
            <FaRegTrashAlt />
          </Button>
        )}
        {type === 'request' && (
          <div className="mx-4 text-4xl text-green-500 hover:text-green-700">
            <button onClick={handleAddFriend} disabled={isWorking}>
              <FaRegCheckCircle />
            </button>
          </div>
        )}
      </li>
    </Link>
  );
}

export default FriendCard;
