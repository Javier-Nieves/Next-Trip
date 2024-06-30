import Link from 'next/link';
import { auth } from '../_lib/auth';
import SignOutButton from './SignOutButton';
import { headers } from 'next/headers';

export default async function Navigation() {
  const session = await auth();
  // console.log('session: ', session);

  const user = session?.user;
  const headersList = headers();
  // read the custom x-url header (from middleware)
  const header_url = headersList.get('x-url') || '';
  const isTripPage = header_url.includes('/trips');

  return (
    <nav className="z-10 text-xl">
      <ul className="flex items-center gap-16">
        {!isTripPage && (
          <li>
            <Link
              href="/search"
              className="transition-colors hover:text-accent-400"
            >
              Search
            </Link>
          </li>
        )}
        {user && !isTripPage && (
          <>
            <li className="hidden lg:block">
              <Link
                href={`/collections/${user?.id}`}
                className="transition-colors hover:text-accent-400"
              >
                My trips
              </Link>
            </li>
            <li className="hidden lg:block">
              <Link
                href="/friends"
                className="transition-colors hover:text-accent-400"
              >
                My friends
              </Link>
            </li>
            <li className="hidden lg:block">
              <Link
                href="/add"
                className="transition-colors hover:text-accent-400"
              >
                Add trip
              </Link>
            </li>
          </>
        )}
        <li>
          {session?.user?.image ? (
            <div className="flex gap-3">
              <Link
                href="/account"
                className="flex items-center transition-colors hover:text-accent-400"
              >
                <img
                  src={session.user.image}
                  className="w-12 border-2 border-white rounded-full aspect-square"
                  alt={session.user.name}
                  referrerPolicy="no-referrer"
                ></img>
                {/* <span className="hidden lg:block">Account</span> */}
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="transition-colors hover:text-accent-400"
            >
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
