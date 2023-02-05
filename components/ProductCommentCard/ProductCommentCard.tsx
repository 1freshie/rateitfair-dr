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
import { useEffect, useState } from "react";

import { db } from "../../firebase/firebaseApp";

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
  const [userProfilePhoto, setUserProfilePhoto] = useState("");
  const [userRateDate, setUserRateDate] = useState(userRatedAt);

  useEffect(() => {
    async function getUserInfo() {
      const userDoc = doc(db, "users", userId);

      const userSnapshot = await getDoc(userDoc);

      const userData = userSnapshot.data() as DocumentData;

      const userProfilePhoto = userData.photoURL;

      setUserProfilePhoto(userProfilePhoto);
    }

    getUserInfo();

    const newUserRateDate = new Date(userRatedAt).toLocaleString();
    setUserRateDate(newUserRateDate);
  }, []);

  return (
    <div className="w-full border border-secondary--orange rounded-[30px]">
      <div className="w-full p-4 flex flex-col justify-center items-center border-b border-b-secondary--orange rounded-t-[30px]">
        <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-x-3 lg:gap-x-6">
          <div className="w-full flex justify-around items-center gap-x-3 lg:gap-x-6">
            <img
              src={
                userProfilePhoto
                  ? userProfilePhoto
                  : "https://via.placeholder.com/40"
              }
              alt="Profile Photo"
              // width={40}
              // height={40}
              className="rounded-full object-center object-cover w-8 h-8 lg:w-10 lg:h-10"
            />
            <p className="paragraph text-primary--orange font-medium">
              {userEmail}
            </p>
          </div>
          <p className="paragraph text-primary--blue font-medium">
            {userRate}/10
          </p>
        </div>
        <p className="paragraph text-secondary--gray">{userRateDate}</p>
      </div>
      <div className="w-full p-4 text-center">
        <p className="paragraph text-primary--blue italic">{userComment}</p>
      </div>
    </div>
  );
}
