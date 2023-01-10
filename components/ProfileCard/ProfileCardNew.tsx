import { DocumentData } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import { faEnvelope, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  // Needs optimization
  // useEffect(() => {
  //   if (user) {
  //     const userRef = doc(db, "users", user!.uid);
  //     const userSnap = getDoc(userRef);
  //     userSnap.then((doc) => {
  //       if (doc.exists()) {
  //         setUserRole(doc.data()!.role);
  //         setUserRatedProductsCount(doc.data()!.ratedProductsCount);
  //       } else {
  //         // doc.data() will be undefined in this case
  //         console.log("No such document!");
  //       }
  //     });
  //   }
  //   // const getUserInfo = async () => {
  //   //   const userRef = doc(db, "users", user!.uid);
  //   //   const userSnap = await getDoc(userRef);
  //   //   setUserRole(userSnap.data()!.role);
  //   //   setUserRatedProductsCount(userSnap.data()!.ratedProductsCount);
  //   // };
  //   // getUserInfo();
  // }, [user]);

  // console.log(user?.photoURL);

  async function handleSignOut() {
    await signOutUser();
    router.replace("/");
  }

  if (loading || error) {
    return <AuthState />;
  }

  return (
    <div className="h-full w-full flex flex-1 justify-center">
      <div className="w-[350px] lg:w-[500px] flex flex-col justify-center items-center border border-primary--blue rounded-[30px] p-6">
        <div className="flex flex-col justify-center items-center">
          <img
            src={userData.photoURL || "https://via.placeholder.com/110"}
            alt="Profile Photo"
            width={110}
            height={110}
            className="rounded-full object-center object-cover"
          />
          <h1 className="heading mt-3">{userData.username}</h1>
          <p className="paragraph mt-2">{userData.role}</p>
        </div>
        <div className="w-5/6 flex flex-col lg:flex-row items-center justify-between mt-6">
          <FontAwesomeIcon icon={faEnvelope} style={iconStyle} />
          <p className="paragraph text-secondary--gray p-1">{userData.email}</p>
        </div>
        <div className="w-5/6 flex flex-col lg:flex-row items-center justify-between">
          <FontAwesomeIcon icon={faStar} style={iconStyle} />
          <p className="paragraph text-secondary--gray">
            {userData.ratedProductsCount} rated products
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="button mt-5 md:mt-7 duration-300 hover:bg-secondary--orange"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
