import Link from 'next/link';
import { auth } from '../_lib/auth';
import SignOutButton from './SignOutButton';

export default async function Navigation() {
  const session = await auth();
  // console.log('session: ', session);
  const user = session?.user;

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href={`/collections/${user?.id}`}
            className="hover:text-accent-400 transition-colors"
          >
            My trips
          </Link>
        </li>
        <li>
          <Link
            href="/friends"
            className="hover:text-accent-400 transition-colors"
          >
            My friends
          </Link>
        </li>
        <li>
          <Link
            href="/search"
            className="hover:text-accent-400 transition-colors"
          >
            Search
          </Link>
        </li>
        <li>
          <Link href="/add" className="hover:text-accent-400 transition-colors">
            Add trip
          </Link>
        </li>
        <li>
          {session?.user?.image ? (
            <div className="flex">
              <Link
                href="/account"
                className="hover:text-accent-400 transition-colors flex gap-4 items-center"
              >
                <img
                  src={session.user.image}
                  className="h-8 rounded-full border-2 border-white"
                  alt={session.user.name}
                  referrerPolicy="no-referrer"
                ></img>
                <span>Account</span>
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="hover:text-accent-400 transition-colors"
            >
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
