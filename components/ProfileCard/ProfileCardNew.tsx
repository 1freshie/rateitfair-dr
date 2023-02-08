import { DocumentData } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import { faEnvelope, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import { signOutUser } from "../../context/auth-context";
import { auth } from "../../firebase/firebaseApp";
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
      <div className="w-full lg:w-[500px] flex flex-col justify-center items-center border border-primary--blue rounded-2xl p-4">
        <div className="flex flex-col justify-center items-center">
          <Image
            src={
              userData.photoURL
                ? userData.photoURL
                : "https://via.placeholder.com/256"
            }
            alt="Profile Photo"
            width={256}
            height={256}
            className="rounded-full object-center object-cover w-auto h-auto"
          />
          <h1 className="heading mt-3">{userData.username}</h1>
          <p className="paragraph mt-2">{userData.role}</p>
        </div>
        <div className="w-full flex flex-col items-center justify-between mt-6">
          <FontAwesomeIcon icon={faEnvelope} style={iconStyle} />
          <p className="paragraph text-secondary--gray">{userData.email}</p>
        </div>
        <div className="w-full mt-2 flex flex-col items-center justify-between">
          <FontAwesomeIcon icon={faStar} style={iconStyle} />
          <p className="paragraph text-secondary--gray">
            {userData.ratedProductsCount} rated products
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="button-orange mt-5 md:mt-7 duration-300"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
