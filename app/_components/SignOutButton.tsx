import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { signOutAction } from '../_lib/actions';

function SignOutButton(): JSX.Element {
  return (
    <form action={signOutAction} className="flex items-center">
      <button className="w-full gap-4">
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
      </button>
    </form>
  );
}

export default SignOutButton;
