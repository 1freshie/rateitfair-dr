"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

import { faEnvelope, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { signOutUser } from "../../context/auth-context";
import { auth, db } from "../../firebase/firebaseApp";
import AuthState from "../AuthState/AuthState";

const iconStyle = {
  width: "20px",
  height: "20px",
  color: "#909CC2",
};

const ProfileCard: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userRole, setUserRole] = useState("Loading...");
  const [userRatedProductsCount, setUserRatedProductsCount] = useState(0);
  const router = useRouter();

  // Needs optimization
  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user!.uid);
      const userSnap = getDoc(userRef);
      userSnap.then((doc) => {
        if (doc.exists()) {
          setUserRole(doc.data()!.role);
          setUserRatedProductsCount(doc.data()!.ratedProductsCount);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      });
    }
    // const getUserInfo = async () => {
    //   const userRef = doc(db, "users", user!.uid);
    //   const userSnap = await getDoc(userRef);
    //   setUserRole(userSnap.data()!.role);
    //   setUserRatedProductsCount(userSnap.data()!.ratedProductsCount);
    // };
    // getUserInfo();
  }, [user]);

  // console.log(user?.photoURL);

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  if (loading || error) {
    return <AuthState />;
  }

  return (
    <div className="w-[350px] lg:w-[500px] flex flex-col justify-center items-center border border-primary--blue rounded-[30px] p-6">
      <div className="flex flex-col justify-center items-center">
        <img
          src={user?.photoURL || "https://via.placeholder.com/110"}
          alt="Profile Photo"
          width={110}
          height={110}
          className="rounded-full object-center object-cover"
        />
        <h1 className="heading mt-3">{user?.displayName}</h1>
        <p className="paragraph mt-2">{userRole}</p>
      </div>
      <div className="w-5/6 flex flex-col lg:flex-row items-center justify-between mt-6">
        <FontAwesomeIcon icon={faEnvelope} style={iconStyle} />
        <p className="paragraph text-secondary--gray p-1">
          {user?.email || ""}
        </p>
      </div>
      <div className="w-5/6 flex flex-col lg:flex-row items-center justify-between">
        <FontAwesomeIcon icon={faStar} style={iconStyle} />
        <p className="paragraph text-secondary--gray">
          {userRatedProductsCount} rated products
        </p>
      </div>
      <button
        onClick={handleSignOut}
        className="button mt-5 md:mt-7 duration-300 hover:bg-secondary--orange"
      >
        Sign out
      </button>
    </div>
  );
};

export default ProfileCard;
