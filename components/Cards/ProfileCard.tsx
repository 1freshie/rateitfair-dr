import { faEnvelope, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
// import { signOut } from "firebase/auth";
import { deleteDoc, doc, DocumentData } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import {
  useAuthState,
  useDeleteUser,
  useSignOut,
} from "react-firebase-hooks/auth";

import { auth, db } from "../../firebaseApp";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";

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
  const [signOut, loadingSignOut, errorSignOut] = useSignOut(auth);
  const [deleteUser, loadingDeleteUser, errorDeleteUser] = useDeleteUser(auth);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cancelButtonRef = useRef(null);

  const router = useRouter();

  // async function handleSignOut() {
  //   await signOut(auth);
  //   router.replace("/");
  // }

  if (loading || loadingSignOut || loadingDeleteUser || isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error.message} />;
  }

  if (errorSignOut) {
    return <ErrorState error={errorSignOut.message} />;
  }

  if (errorDeleteUser) {
    return <ErrorState error={errorDeleteUser.message} />;
  }

  if (!user) {
    router.push("/login");
  }

  async function handleSignOut() {
    if (!user) return;

    const success = await signOut();

    if (!success) {
      return <ErrorState error="Something went wrong!" />;
    }

    router.replace("/login");
  }

  async function handleDeleteUser() {
    if (!user) return;

    setIsLoading(true);

    const userDoc = doc(db, "users", user.uid);

    try {
      await deleteDoc(userDoc);
    } catch (error: any) {
      return <ErrorState error={error.message} />;
    }

    setIsLoading(false);

    const success = await deleteUser();

    if (!success) {
      return <ErrorState error="Something went wrong!" />;
    }

    router.replace("/signup");

    setConfirmDelete(false);

    // TODO: REMOVE USER PROFILE PHOTO FROM STORAGE
  }

  // if (errorSignOut) {
  //   return <ErrorState error={errorSignOut.message} />;
  // }

  return (
    <div className="h-full w-full flex justify-center">
      <div className="w-full lg:w-[500px] flex flex-col justify-center items-center gap-y-6 border border-primary--blue rounded-2xl p-4">
        <div className="flex flex-col justify-center items-center gap-y-2">
          <div className="w-24 h-24">
            <Image
              src={
                userData.photoURL
                  ? userData.photoURL
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
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
              <span className="font-medium">
                {userData.ratedProducts ? userData.ratedProducts.length : 0}
              </span>{" "}
              rated products
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-y-2">
          <button onClick={handleSignOut} className="button-blue duration-300">
            Sign out
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="button-orange duration-300 bg-error--red border-error--red hover:text-error--red hover:bg-background--white"
          >
            Delete me
          </button>
        </div>
      </div>

      <Transition.Root show={confirmDelete} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          initialFocus={cancelButtonRef}
          onClose={() => setConfirmDelete(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#000000] bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-background--white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg px-4 pt-5 pb-4 sm:p-6 sm:pb-5">
                  <div className="w-full h-full flex flex-col items-center justify-center gap-y-4">
                    <p className="paragraph text-error--red">Warning</p>
                    <p className="small-paragraph text-center">
                      Are you sure you want to delete your account?
                      <br />
                      This includes all your ratings, comments and other
                      important information.
                      <br />
                      <span className="text-secondary--orange">
                        This action cannot be undone.
                      </span>
                    </p>
                    <div className="flex flex-col lg:flex-row-reverse justify-center items-center lg:items-end w-full lg:gap-x-3">
                      <button
                        className="button-orange duration-300 bg-error--red border-error--red hover:text-error--red hover:bg-background--white"
                        onClick={handleDeleteUser}
                      >
                        Delete me
                      </button>
                      <button
                        className="button-blue mt-3 lg:mt-4 bg-background--white text-primary--blue  hover:bg-primary--blue hover:text-background--white duration-300"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.preventDefault();
                          setConfirmDelete(false);
                        }}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
