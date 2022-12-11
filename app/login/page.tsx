import Link from 'next/link';

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
        <p className="paragraph text-secondary--gray">Or continue with...</p>
        <div className="flex flex-row justify-between w-full gap-x-6">
          <button className="input flex items-center justify-between">
            <p className="paragraph text-secondary--gray">Facebook</p>
          </button>
          <button className="input flex items-center justify-between">
            <p className="paragraph text-secondary--gray">Google</p>
          </button>
        </div>
        <Link href="#" className="paragraph mt-5 hover:text-primary--orange">
          Forgot your password? Click here.
        </Link>
        {/* Forgot your password field must be button with functionality, not Link! */}
        <Link href="/signup" className="paragraph hover:text-primary--orange">
          Don't have an account? Click here.
        </Link>
        <button type="submit" className="button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
