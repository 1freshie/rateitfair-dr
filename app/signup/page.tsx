'use client';

import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../../firebase/firebaseApp';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import SignInWithFacebook from '../../components/SignIn/SignInWithFacebook';
import SignInWithGoogle from '../../components/SignIn/SignInWithGoogle';

const SignUpPage = () => {
  const [user, loading, error] = useAuthState(auth);

  // if (user) {
  //   return <h1>Welcome, {user.displayName}</h1>
  // }

  if (loading)
    return (
      <div className="flex h-96 flex-1 justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <div className="flex h-96 flex-1 justify-center items-center">
        <p className="paragraph text-center text-error--red">{error.message}</p>
        ;
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
        <button
          type="submit"
          className="button mt-3 md:mt-5 duration-300 hover:bg-secondary--orange"
        >
          Sign Up
        </button>
      </form>
      <div className="form mt-4 md:mt-6 gap-y-3 max-w-xs md:max-w-sm lg:max-w-md">
        <p className="paragraph text-secondary--gray">Or continue with...</p>
        <div className="flex flex-row justify-between w-full gap-x-6">
          <SignInWithFacebook />
          <SignInWithGoogle />
        </div>
      </div>
      <Link
        href="/login"
        className="paragraph mt-6 duration-300 hover:text-primary--orange"
      >
        Already have an account? Click here.
      </Link>
    </div>
  );
};

export default SignUpPage;
