import { Dialog, Transition } from "@headlessui/react";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { validateImage } from "image-validator";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
} from "react-firebase-hooks/auth";

import FileInput from "../../components/inputs/FileInput";
import Input from "../../components/inputs/Input";
import SignInWithFacebook from "../../components/signInMethods/SignInWithFacebook";
import SignInWithGoogle from "../../components/signInMethods/SignInWithGoogle";
import LoadingState from "../../components/states/LoadingState";
import { auth, db, storage } from "../../firebaseApp";

interface SignUpData {
  takenUsernames: string[];
}

export default function SignUpPage({ takenUsernames }: SignUpData) {
  const [user, loading, error] = useAuthState(auth);
  const [
    createUserWithEmailAndPassword,
    createUser,
    createUserLoading,
    createUserError,
  ] = useCreateUserWithEmailAndPassword(auth, {
    sendEmailVerification: true,
  });

  const router = useRouter();

  // const [uploadFile, uploadLoading, uploadSnapshot, uploadError] =
  //   useUploadFile();
  const [file, setFile] = useState<File>();
  const [filePreviewURL, setFilePreviewURL] = useState("");

  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const closeButtonRef = useRef(null);

  if (loading || createUserLoading || isLoading) {
    return <LoadingState />;
  }

  // if (user) {
  //   router.push("/");
  // }

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEnteredUsername(e.target.value);
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEnteredEmail(e.target.value);
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEnteredPassword(e.target.value);
  }

  function handleConfirmPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEnteredConfirmPassword(e.target.value);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : undefined;
    if (file === undefined) return;

    if (file.size > 10000000) {
      setErrorMessage("File size is too large.");
      return;
    }

    const isValidImage = await validateImage(file);

    if (!isValidImage) {
      setErrorMessage("File is not an image.");
      return;
    }

    setFile(file);

    if (file) {
      setFilePreviewURL(URL.createObjectURL(file));
    }
  }

  async function handleSubmitSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (enteredUsername === "") {
      setErrorMessage("Please enter your username.");
      return;
    }

    if (!enteredUsername.match(/^[a-zA-Z0-9]+$/)) {
      setErrorMessage("Username can only contain letters and numbers.");
      return;
    }

    if (enteredUsername.length < 3) {
      setErrorMessage("Username must be at least 3 characters long.");
      return;
    }

    if (takenUsernames.includes(enteredUsername)) {
      setErrorMessage("Username is already taken.");
      return;
    }

    if (enteredEmail === "") {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (enteredPassword === "") {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (enteredPassword !== enteredConfirmPassword) {
      setErrorMessage("Passwords do not match.");
      setEnteredPassword("");
      setEnteredConfirmPassword("");
      return;
    }

    if (
      !enteredPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    ) {
      setErrorMessage(
        "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number."
      );
      setEnteredPassword("");
      setEnteredConfirmPassword("");
      return;
    }

    setIsLoading(true);

    const newUser = await createUserWithEmailAndPassword(
      enteredEmail,
      enteredPassword
    );

    if (!newUser) return;

    if (file) {
      // console.log("uploading file...");
      const storageRef = ref(
        storage,
        `users/${newUser.user.uid}/profilePhoto/`
      );

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // const progress =
          //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          setErrorMessage(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log("File available at", downloadURL);
            // setFileDownloadURL(downloadURL);

            const userDoc = doc(db, "users", newUser.user.uid);

            try {
              setDoc(userDoc, {
                id: newUser.user.uid,
                username: enteredUsername,
                email: enteredEmail,
                photoURL: downloadURL,
                role: "User",
                orgId: "",
              });
            } catch (error: any) {
              setErrorMessage(error.message);
            }
          });
        }
      );
    } else {
      const userDoc = doc(db, "users", newUser.user.uid);

      try {
        await setDoc(userDoc, {
          id: newUser.user.uid,
          username: enteredUsername,
          email: enteredEmail,
          photoURL: "",
          role: "User",
          orgId: "",
        });
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    }

    setIsLoading(false);

    setIsOpen(true);

    setEnteredEmail("");
    setEnteredPassword("");
    setEnteredConfirmPassword("");

    setErrorMessage("");
  }

  return (
    <>
      <Head>
        <title>RateItFair - Sign up</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Sign up and start rating products!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative self-center justify-self-center flex-1 flex flex-col items-center justify-center gap-y-8">
        <header className="text-center">
          <h1 className="heading">Here for the first time?</h1>
          <p className="paragraph">Create your new account!</p>
        </header>
        <form
          onSubmit={handleSubmitSignUp}
          className="form gap-y-4 max-w-xs md:max-w-sm lg:max-w-md"
        >
          {errorMessage && (
            <p className="small-paragraph text-error--red text-center">
              {errorMessage}
            </p>
          )}
          {error && (
            <p className="small-paragraph text-error--red text-center">
              {error.message}
            </p>
          )}
          {createUserError && (
            <p className="small-paragraph text-error--red text-center">
              {createUserError.code}
              <br />
              {createUserError.message}
            </p>
          )}
          {/* {uploadError && (
            <p className="small-paragraph text-error--red text-center">
              {uploadError.code}
              <br />
              {uploadError.message}
            </p>
          )} */}
          <Input
            label="Username"
            id="username"
            name="username"
            type="text"
            value={enteredUsername}
            placeholder="e.g. johnDoe"
            onChange={handleUsernameChange}
          />
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            value={enteredEmail}
            placeholder="e.g. your@email.com"
            onChange={handleEmailChange}
          />
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            value={enteredPassword}
            placeholder="********"
            onChange={handlePasswordChange}
          />
          <Input
            label="Confirm Password"
            id="confirm-password"
            name="confirm-password"
            type="password"
            value={enteredConfirmPassword}
            placeholder="********"
            onChange={handleConfirmPasswordChange}
          />
          <FileInput
            label="Profile Photo"
            id="profile-photo"
            name="profile-photo"
            filePreviewURL={filePreviewURL}
            onChange={handleFileChange}
          />
          <button type="submit" className="button-orange mt-4 duration-300">
            Sign up
          </button>
        </form>
        <div className="form gap-y-3 max-w-xs md:max-w-sm lg:max-w-md">
          <p className="small-paragraph">Or continue with...</p>
          <div className="flex flex-row justify-between w-full gap-x-6">
            <SignInWithFacebook />
            <SignInWithGoogle />
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-y-1">
          <Link
            href="/login"
            className="small-paragraph text-secondary--orange duration-300 hover:text-primary--orange"
          >
            Already have an account? Click here.
          </Link>
        </div>
      </div>

      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          initialFocus={closeButtonRef}
          onClose={() => {
            setIsOpen(false);
            router.push("/").then(() => {
              window.location.reload();
            });
          }}
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
                    <p className="small-paragraph text-primary--blue text-center">
                      To ensure the security of your account, we require email
                      verification.
                      <br />
                      You won't be able to fully access your account until your
                      email is verified.
                    </p>
                    <div className="flex flex-col lg:flex-row-reverse justify-center items-center lg:items-end w-full lg:gap-x-3">
                      <button
                        className="button-blue duration-300"
                        onClick={() => {
                          setIsOpen(false);
                          router.push("/").then(() => {
                            window.location.reload();
                          });
                        }}
                        ref={closeButtonRef}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export const getStaticProps: GetStaticProps<SignUpData> = async (context) => {
  const usersDocs = await getDocs(collection(db, "users"));

  const takenUsernames = usersDocs.docs.map((doc) => doc.data().username);

  return {
    props: {
      takenUsernames,
    },
    revalidate: 1,
  };
};
