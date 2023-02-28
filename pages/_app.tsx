import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import NavbarNew from "../components/Navbar/NavbarNew";
import ErrorState from "../components/states/ErrorState";
import LoadingState from "../components/states/LoadingState";
import { auth } from "../firebaseApp";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading, error] = useAuthState(auth);

  const [isVerifiedUser, setIsVerifiedUser] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // const router = useRouter();

  useEffect(() => {
    setIsLoading(true);

    if (user) {
      if (
        user.emailVerified ||
        user.providerId === "google.com" ||
        user.providerId === "facebook.com"
      ) {
        setIsVerifiedUser(true);
      }
    }

    setIsLoading(false);
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-1 justify-center items-center">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-1 justify-center items-center">
        <ErrorState error={error.message} />
      </div>
    );
  }

  // if (!user) {
  //   router.replace("/login");
  // }

  return (
    <div className="min-h-screen flex flex-col py-5 px-7 md:py-10 md:px-14 bg-background--white font-Montserrat">
      <NavbarNew />
      <div className="flex flex-1 z-0">
        {!isVerifiedUser ? (
          <div className="w-full h-full self-center flex flex-col justify-center items-center text-center">
            <p>Email not verified!</p>
            <p>
              Please verify your email <strong>{user?.email}</strong> to
              continue.
            </p>
          </div>
        ) : (
          <Component {...pageProps} />
        )}

        {/* div className="self-center flex flex-1 flex-col justify-center items-center gap-y-2">
             <p>Please sign in to continue.</p>
             <Link href="/login" className="button-blue">Login</Link>
             <p>No account yet? Sign up now!</p>
             <Link href="/signup" className="button-orange">Sign up</Link>
           </div> */}

        {/* <Component {...pageProps} /> */}
      </div>
    </div>
  );
}
