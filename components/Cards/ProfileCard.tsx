import { DocumentData } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import { faEnvelope, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import { signOutUser } from "../../context/auth-context";
import { auth } from "../../firebaseApp";
import AuthState from "../AuthState/AuthState";

interface UserData {
  userData: DocumentData;
}

const iconStyle = {
  width: "20px",
  height: "20px",
  color: "#909CC2",
};

export default function ProfileCard({ userData }: UserData) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  async function handleSignOut() {
    await signOutUser();
    router.replace("/");
  }

  if (loading || error) {
    return <AuthState />;
  }

  return (
    <div className="h-full w-full flex justify-center">
      <div className="w-full lg:w-[500px] flex flex-col justify-center items-center gap-y-6 border border-primary--blue rounded-2xl p-4">
        <div className="flex flex-col justify-center items-center gap-y-2">
          <div className="w-24 h-24">
            <Image
              src={
                userData.photoURL
                  ? userData.photoURL
                  : "https://via.placeholder.com/96"
              }
              alt="Profile Photo"
              width={96}
              height={96}
              className="rounded-full w-full h-full"
              priority={true}
            />
          </div>
          <div className="w-full h-full flex flex-col justify-center items-center">
            <h1 className="heading">{userData.username}</h1>
            <p className="paragraph">{userData.role}</p>
          </div>
        </div>
        <div className="w-full h-full flex flex-col items-center justify-center gap-y-2">
          <div className="w-full flex flex-col items-center justify-between gap-y-1">
            <FontAwesomeIcon icon={faEnvelope} style={iconStyle} />
            <p className="small-paragraph">{userData.email}</p>
          </div>
          <div className="w-full flex flex-col items-center justify-between gap-y-1">
            <FontAwesomeIcon icon={faStar} style={iconStyle} />
            <p className="small-paragraph">
              <span className="font-medium">{userData.ratedProductsCount}</span>{" "}
              rated products
            </p>
          </div>
        </div>
        <button onClick={handleSignOut} className="button-blue duration-300">
          Sign out
        </button>
      </div>
    </div>
  );
}
