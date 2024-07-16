import Link from 'next/link';
import { auth } from '../_lib/auth';
import SignOutButton from './SignOutButton';

export default async function Navigation() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="text-2xl font-light">
      <ul className="flex items-center gap-16">
        <li className="hidden min-[630px]:block">
          <Link
            href="/search"
            className="transition-colors hover:text-[var(--color-accent-darkest)] text-stone-700"
          >
            Search
          </Link>
        </li>
        {user && (
          <>
            <li className="hidden lg:block">
              <Link
                href={`/collections/${user?.id}`}
                className="transition-colors hover:text-[var(--color-accent-darkest)] text-stone-700"
              >
                My trips
              </Link>
            </li>
            <li className="hidden lg:block ">
              <Link
                href="/friends"
                className="transition-colors hover:text-[var(--color-accent-darkest)] text-stone-700"
              >
                My friends
              </Link>
            </li>
            <li className="hidden lg:block ">
              <Link
                href="/add"
                className="transition-colors hover:text-[var(--color-accent-darkest)] text-stone-700"
              >
                Add trip
              </Link>
            </li>
          </>
        )}
        <li className="z-50">
          {session?.user?.image ? (
            <div className="flex gap-3">
              <Link
                href="/account"
                className="flex items-center transition-colors hover:text-[var(--color-accent-darkest)] text-stone-700"
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
              className="z-50 transition-colors hover:text-[var(--color-accent-darkest)] text-stone-700"
            >
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
