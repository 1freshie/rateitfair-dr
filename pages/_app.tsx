import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import NavbarNew from "../components/Navbar/NavbarNew";
import ErrorState from "../components/states/ErrorState";
import LoadingState from "../components/states/LoadingState";
import { auth } from "../firebaseApp";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading, error] = useAuthState(auth);

  const router = useRouter();

  if (loading) {
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

  if (!user) {
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex flex-col py-5 px-7 md:py-10 md:px-14 bg-background--white font-Montserrat">
      <NavbarNew />
      <div className="flex flex-1 z-0">
        {/* {user?.emailVerified ? (
          <div className="w-full h-full self-center flex flex-col justify-center items-center text-center">
            <p>Email not verified!</p>
            <p>Please verify your email to continue.</p>
          </div>
        ) : (
          <Component {...pageProps} />
        )} */}
        <Component {...pageProps} />
      </div>
    </div>
  );
}
