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

      <div className="flex flex-col items-center justify-center">
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
      </div>
    </>
  );
}
