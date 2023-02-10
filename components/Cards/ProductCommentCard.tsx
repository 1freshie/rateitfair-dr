import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "../../firebase/firebaseApp";

interface ProductCommentCardProps {
  userId: string;
  userComment: string;
  userRate: number;
  userRatedAt: string;
  userEmail: string;
}

export default function ProductCommentCard({
  userId,
  userComment,
  userRate,
  userRatedAt,
  userEmail,
}: ProductCommentCardProps) {
  const [user, loading, error] = useAuthState(auth);

  const [userProfilePhoto, setUserProfilePhoto] = useState("");
  // const [userRateDate, setUserRateDate] = useState(userRatedAt);

  useEffect(() => {
    async function getUserInfo() {
      if (user) {
        const userDoc = doc(db, "users", user.uid);

        const userSnapshot = await getDoc(userDoc);

        const userData = userSnapshot.data() as DocumentData;

        const userProfilePhoto = userData.photoURL;

        setUserProfilePhoto(userProfilePhoto);
      }
    }

    getUserInfo();
  }, [user]);

  return (
    <div className="w-full h-full border border-secondary--orange rounded-2xl">
      <div className="w-full p-4 flex flex-col justify-center items-center border-b border-b-secondary--orange rounded-t-2xl">
        <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-y-3 lg:gap-x-6">
          <div className="w-full flex justify-around items-center gap-x-3">
            <Image
              src={
                userProfilePhoto
                  ? userProfilePhoto
                  : "https://via.placeholder.com/40"
              }
              width={40}
              height={40}
              alt="Profile Photo"
              className="rounded-full object-center object-cover w-auto h-auto"
              priority={true}
            />
            <p className="paragraph text-primary--orange font-medium text-center">
              {userEmail}
            </p>
          </div>
          <p className="heading">{`${userRate}/10`}</p>
        </div>
        <p className="small-paragraph">{userRatedAt}</p>
      </div>
      <div className="w-full h-full p-4 text-center">
        <p className="paragraph w-full h-auto text-primary--blue italic">
          {userComment}
        </p>
      </div>
    </div>
  );
}
