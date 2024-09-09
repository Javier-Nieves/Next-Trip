import Link from 'next/link';
import {
  FaListUl,
  FaSearchengin,
  FaGlobeAmericas,
  FaMapMarkedAlt,
  FaUserFriends,
} from 'react-icons/fa';
import { auth } from '../_lib/auth';
import SignOutButton from './SignOutButton';
import ExpandableMenu from './ExpandableMenu';

export default async function Navigation(): Promise<JSX.Element> {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="z-50 flex items-center gap-4 text-2xl font-light">
      <ExpandableMenu icon={<FaListUl />} type="nav">
        <li className="flex justify-center p-2 cursor-pointer hover:bg-[var(--color-grey-tr-7)] hover:rounded-lg font-medium text-black">
          <Link
            href="/search"
            className="flex items-center justify-center w-full gap-2"
          >
            <FaSearchengin /> Search
          </Link>
        </li>
        {user && (
          <>
            <li className="flex justify-center p-2 cursor-pointer hover:bg-[var(--color-grey-tr-7)] hover:rounded-lg font-medium text-black">
              <Link
                href={`/collections/${user?.id}`}
                className="flex items-center justify-center w-full gap-2"
              >
                <FaGlobeAmericas /> My trips
              </Link>
            </li>
            <li className="flex justify-center p-2 cursor-pointer hover:bg-[var(--color-grey-tr-7)] hover:rounded-lg font-medium text-black">
              <Link
                href="/friends"
                className="flex items-center justify-center w-full gap-2"
              >
                <FaUserFriends /> My friends
              </Link>
            </li>
            <li className="flex justify-center p-2 cursor-pointer hover:bg-[var(--color-grey-tr-7)] hover:rounded-lg font-medium text-black">
              <Link
                href="/add"
                className="flex items-center justify-center w-full gap-2"
              >
                <FaMapMarkedAlt /> Add trip
              </Link>
            </li>
          </>
        )}
      </ExpandableMenu>
      <div className="z-50">
        {session?.user?.image ? (
          <div className="flex gap-3">
            <Link href="/account" className="flex items-center">
              <img
                src={session.user.image}
                className="w-12 border-2 border-white rounded-full shadow-lg aspect-square"
                alt={session.user.name}
                referrerPolicy="no-referrer"
              />
            </Link>
            <SignOutButton />
          </div>
        ) : (
          <Link
            href="/login"
            className="z-50 text-2xl font-medium hover:drop-shadow-lg"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
