import Head from "next/head";
import Link from "next/link";
import SignInWithFacebook from "../../components/SignIn/SignInWithFacebook";
import SignInWithGoogle from "../../components/SignIn/SignInWithGoogle";

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>RateItFair - Sign up</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Sign up and start rating products!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <div className="self-center justify-self-center flex-1 flex flex-col items-center justify-center">
        <header className="text-center">
          <h1 className="heading">Here for a first time?</h1>
          <p className="paragraph mt-2 md:mt-3">Create your new account!</p>
        </header>
        <form className="form mt-8 md:mt-10 gap-y-3 max-w-xs md:max-w-sm lg:max-w-md">
          <div className="w-full flex flex-col justify-center gap-y-1">
            <label
              htmlFor="email"
              className="small-paragraph text-secondary--orange ml-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter here..."
              className="input"
            />
          </div>
          <div className="w-full flex flex-col justify-center gap-y-1">
            <label
              htmlFor="password"
              className="small-paragraph text-secondary--orange ml-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter here..."
              className="input"
            />
          </div>
          <div className="w-full flex flex-col justify-center gap-y-1">
            <label
              htmlFor="confirmPassword"
              className="small-paragraph text-secondary--orange ml-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Enter here..."
              className="input"
            />
          </div>
          <button
            type="submit"
            className="button-orange mt-3 md:mt-5 duration-300 hover:bg-secondary--orange"
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
      </div> */}

      <div className="self-center justify-self-center flex-1 flex flex-col items-center justify-center gap-y-8">
        <header className="text-center">
          <h1 className="heading">Here for a first time?</h1>
          <p className="paragraph">Create your new account!</p>
        </header>
        <form className="form gap-y-3 max-w-xs md:max-w-sm lg:max-w-md">
          <div className="w-full flex flex-col justify-center gap-y-1">
            <label
              htmlFor="email"
              className="small-paragraph text-secondary--orange ml-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter here..."
              className="input"
            />
          </div>
          <div className="w-full flex flex-col justify-center gap-y-1">
            <label
              htmlFor="password"
              className="small-paragraph text-secondary--orange ml-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter here..."
              className="input"
            />
          </div>
          <div className="w-full flex flex-col justify-center gap-y-1">
            <label
              htmlFor="confirmPassword"
              className="small-paragraph text-secondary--orange ml-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Enter here..."
              className="input"
            />
          </div>
          <button
            type="submit"
            className="button-orange mt-3 md:mt-5 duration-300"
          >
            Sign up
          </button>
        </form>
        <div className="form gap-y-3 max-w-xs md:max-w-sm lg:max-w-md">
          <p className="small-paragraph">Or continue with...</p>
          <div className="flex flex-row justify-between w-full gap-x-6">
            <SignInWithFacebook />
            <SignInWithGoogle />
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-y-1">
          <Link
            href="/login"
            className="small-paragraph text-secondary--orange duration-300 hover:text-primary--orange"
          >
            Already have an account? Click here.
          </Link>
        </div>
      </div>
    </>
  );
}
