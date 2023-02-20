import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import Input from "../../components/inputs/Input";

import SignInWithFacebook from "../../components/signInMethods/SignInWithFacebook";
import SignInWithGoogle from "../../components/signInMethods/SignInWithGoogle";
import ErrorState from "../../components/states/ErrorState";
import LoadingState from "../../components/states/LoadingState";
import { auth } from "../../firebaseApp";

export default function LoginPage() {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEnteredEmail(e.target.value);
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEnteredPassword(e.target.value);
  }

  if (loading) {
    return <LoadingState />;
  }

  // if (error) {
  //   return <ErrorState error={error.code} code={error.code} />;
  // }

  function handleSubmitLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (enteredEmail === "") {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (enteredPassword === "") {
      setErrorMessage("Please enter your password.");
      return;
    }

    signInWithEmailAndPassword(enteredEmail, enteredPassword);

    setEnteredEmail("");
    setEnteredPassword("");

    setErrorMessage("");
  }

  return (
    <>
      <Head>
        <title>RateItFair - Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Log in and continue rating products!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="self-center justify-self-center flex-1 flex flex-col items-center justify-center gap-y-8">
        <header className="text-center">
          <h1 className="heading">Welcome back!</h1>
          <p className="paragraph">Login to continue...</p>
        </header>
        <form
          onSubmit={handleSubmitLogin}
          className="form gap-y-3 max-w-xs md:max-w-sm lg:max-w-md"
        >
          {errorMessage && (
            <p className="small-paragraph text-error--red text-center">
              {errorMessage}
            </p>
          )}
          {error && (
            <p className="small-paragraph text-error--red text-center">
              Incorrect email or password!
              <br />
              Please try again.
            </p>
          )}
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            value={enteredEmail}
            placeholder="user@email.com"
            onChange={handleEmailChange}
          />
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            value={enteredPassword}
            placeholder="********"
            onChange={handlePasswordChange}
          />
          <button
            type="submit"
            className="button-orange mt-3 md:mt-5 duration-300"
          >
            Login
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
            href="#"
            className="small-paragraph text-secondary--orange duration-300 hover:text-primary--orange"
          >
            Forgot your password? Click here.
          </Link>
          <Link
            href="/signup"
            className="small-paragraph text-secondary--orange duration-300 hover:text-primary--orange"
          >
            Don't have an account? Click here.
          </Link>
        </div>
      </div>
    </>
  );
}
