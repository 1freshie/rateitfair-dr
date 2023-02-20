import { Dialog, Transition } from "@headlessui/react";
import { ref } from "firebase/storage";
import { validateImage } from "image-validator";
import { url } from "inspector";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { title } from "process";
import { Fragment, useRef, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useUploadFile } from "react-firebase-hooks/storage";
import FileInput from "../../components/inputs/FileInput";
import Input from "../../components/inputs/Input";

import SignInWithFacebook from "../../components/signInMethods/SignInWithFacebook";
import SignInWithGoogle from "../../components/signInMethods/SignInWithGoogle";
import ErrorState from "../../components/states/ErrorState";
import LoadingState from "../../components/states/LoadingState";
import { auth, storage } from "../../firebaseApp";

export default function SignUpPage() {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth, {
      sendEmailVerification: true,
    });

  const router = useRouter();

  const [uploadFile, uploadLoading, uploadSnapshot, uploadError] =
    useUploadFile();
  // const storageRef = ref(storage, `users/${user?.user.uid}/profilePhoto/`);
  const [file, setFile] = useState<File>();
  const [filePreviewURL, setFilePreviewURL] = useState("");

  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const closeButtonRef = useRef(null);

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
    // console.log(file?.size)
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

  async function handleFileUpload() {
    let uploadResult;

    if (user) {
      if (file) {
        uploadResult = await uploadFile(
          ref(storage, `users/${user.user.uid}/profilePhoto/`),
          file
        );
      }
    }

    console.log(uploadResult);
  }

  if (loading || uploadLoading) {
    return <LoadingState />;
  }

  // if (error) {
  //   return <ErrorState error={error.name} code={error.code} />;
  // }

  function handleSubmitSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

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
      return;
    }

    if (
      !enteredPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    ) {
      setErrorMessage(
        "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number."
      );
      return;
    }

    if (!error) {
      createUserWithEmailAndPassword(enteredEmail, enteredPassword);

      handleFileUpload();

      setIsOpen(true);
    }

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
          <h1 className="heading">Here for a first time?</h1>
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
              {error.code}
              <br />
              {error.message}
            </p>
          )}
          {uploadError && (
            <p className="small-paragraph text-error--red text-center">
              {uploadError.code}
              <br />
              {uploadError.message}
            </p>
          )}
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            value={enteredEmail}
            placeholder="user@email.com"
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
            router.push("/login");
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
                          router.push("/login");
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
