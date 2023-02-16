"use client";

import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../../firebaseApp";
import LoadingSpinner from "../States/LoadingSpinner";

export default function AuthState() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="self-center flex flex-1 justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="self-center flex flex-1 justify-center items-center">
        <p className="paragraph text-center text-error--red">{error.message}</p>
      </div>
    );
  }

  return <></>;
}
