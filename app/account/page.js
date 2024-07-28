import Button from '../_components/Button';
import Spinner from '../_components/Spinner';
import { signOutAction } from '../_lib/actions';
import { auth } from '../_lib/auth';

export const metadata = {
  title: 'Account',
};

export default async function Page() {
  const session = await auth();

  if (!session.user) return <Spinner />;

  return (
    <form
      action={signOutAction}
      className="flex flex-col items-center justify-center h-full"
    >
      <img
        src={session.user.image}
        className="m-8 border-2 border-white rounded-full shadow-lg w-30 aspect-square"
        alt={session.user.name}
        referrerPolicy="no-referrer"
      />
      <h2 className="text-4xl font-semibold text-accent-400 mb-7">
        {session?.user?.name}
      </h2>
      <h2 className="text-2xl font-semibold text-accent-400 mb-7">
        {session?.user?.email}
      </h2>
      <Button type="bright">Logout</Button>
    </form>
  );
}
