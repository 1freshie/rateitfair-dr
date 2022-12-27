import Link from 'next/link';
import SignInWithFacebook from '../../components/SignIn/SignInWithFacebook';
import SignInWithGoogle from '../../components/SignIn/SignInWithGoogle';

const LoginPage = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <header className="mt-16 text-center">
        <h1 className="heading">Welcome back!</h1>
        <p className="paragraph mt-2 md:mt-3">Login to continue...</p>
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
        <button type="submit" className="button mt-3 md:mt-5 duration-300 hover:bg-secondary--orange">
          Login
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
        href="#"
        className="paragraph mt-5 duration-300 hover:text-primary--orange"
      >
        Forgot your password? Click here.
      </Link>
      <Link
        href="/signup"
        className="paragraph duration-300 hover:text-primary--orange"
      >
        Don't have an account? Click here.
      </Link>
    </div>
  );
};

export default LoginPage;
