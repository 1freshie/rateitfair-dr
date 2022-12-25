'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../../firebase/firebaseApp';
import SignInWithGoogle from '../../components/SignIn/SignInWithGoogle';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const SignUpPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  if (user) {
    router.push('/');
  }

  if (loading)
    return (
      <div className="flex h-96 flex-1 justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  if (error) return (
    <div className="flex h-96 flex-1 justify-center items-center">
      <p className="paragraph text-center text-error--red">{error.message}</p>;
    </div>
  );

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <header className="mt-16 text-center">
        <h1 className="heading">Here for a first time?</h1>
        <p className="paragraph mt-2 md:mt-3">Create your new account!</p>
      </header>
      <form className="form mt-8 md:mt-10 gap-y-3 max-w-xs md:max-w-sm lg:max-w-md">
        <input
          type="email"
          placeholder="Enter your email..."
          className="input"
        />
        <input
          type="password"
          placeholder="Enter your password..."
          className="input"
        />
        <input
          type="password"
          placeholder="Confirm your password..."
          className="input"
        />
        <p className="paragraph text-secondary--gray">Or continue with...</p>
        <div className="flex flex-row justify-between w-full gap-x-6">
          <button className="input flex items-center justify-between">
            <p className="paragraph text-secondary--gray">Facebook</p>
          </button>
          <SignInWithGoogle />
        </div>
        <Link
          href="/login"
          className="paragraph mt-5 hover:text-primary--orange"
        >
          Already have an account? Click here.
        </Link>
        <button type="submit" className="button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
