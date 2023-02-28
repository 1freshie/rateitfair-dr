import { StarIcon } from "@heroicons/react/24/solid";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "../../firebaseApp";

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

  const [username, setUsername] = useState("");
  const [userProfilePhoto, setUserProfilePhoto] = useState("");
  // const [userRateDate, setUserRateDate] = useState(userRatedAt);

  useEffect(() => {
    async function getUserInfo() {
      if (user) {
        const userDoc = doc(db, "users", user.uid);

        const userSnapshot = await getDoc(userDoc);

        const userData = userSnapshot.data() as DocumentData;

        const username = userData.username;

        const userProfilePhoto = userData.photoURL;

        setUsername(username);
        setUserProfilePhoto(userProfilePhoto);
      }
    }

    getUserInfo();
  }, [user]);

  return (
    <article className="w-full h-full border border-secondary--orange rounded-2xl">
      <div className="w-full p-4 flex flex-col justify-center items-center border-b border-b-secondary--orange rounded-t-2xl">
        <div className="w-full flex flex-col justify-between items-center gap-y-1">
          <div className="w-full flex flex-col justify-center items-center gap-y-2">
            <div className="w-8 h-8">
              <Image
                src={
                  userProfilePhoto
                    ? userProfilePhoto
                    : "https://via.placeholder.com/32"
                }
                width={32}
                height={32}
                alt="Profile Photo"
                className="rounded-full object-center object-cover w-full h-full"
                priority={true}
              />
            </div>
            <p className="small-paragraph text-primary--blue font-medium text-center">
              {username}{" "}
              <span className="text-secondary--gray font-normal">
                {userEmail}
              </span>
            </p>
          </div>
          <div className="flex justify-center items-center gap-x-1">
            <p className="paragraph">
              <span className="text-primary--orange font-medium">
                {userRate}
              </span>
              /10
            </p>
            <StarIcon
              fill="none"
              stroke="currentColor"
              className="w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 text-secondary--orange"
            />
          </div>
        </div>
        <p className="small-paragraph">{userRatedAt}</p>
      </div>
      <div className="w-full h-full p-4 heading text-center text-primary--blue">
        "{" "}
        <em className="paragraph w-full h-auto text-secondary--gray italic">
          {userComment}
        </em>
        {" "}"
      </div>
    </article>
  );
}
