import SignInButton from '@/app/_components/SignInButton';

export const metadata = {
  title: 'Login',
};

export default function Page() {
  return (
    <div className="flex flex-col items-center gap-10 mt-20">
      <h2 className="text-3xl font-semibold">Sign in to access your account</h2>
      <SignInButton />
    </div>
  );
}
