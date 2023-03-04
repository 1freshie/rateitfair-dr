import { uuidv4 } from "@firebase/util";
import { Dialog, Transition } from "@headlessui/react";
import {
  arrayUnion,
  doc,
  DocumentData,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { validateImage } from "image-validator";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import { useUploadFile } from "react-firebase-hooks/storage";

import { db, storage } from "../../firebaseApp";
import FileInput from "../inputs/FileInput";
import Input from "../inputs/Input";
import TextArea from "../inputs/TextArea";
import LoadingState from "../states/LoadingState";

interface AddProductModalProps {
  orgId: string;
  orgData?: DocumentData;
  isOpen: boolean;
  closeModal: () => void;
}

export default function AddProductModal({
  orgId,
  isOpen,
  closeModal,
}: AddProductModalProps) {
  const [enteredProductTitle, setEnteredProductTitle] = useState("");
  const [enteredProductDescription, setEnteredProductDescription] =
    useState("");

  const [uploadFile, uploadLoading, uploadSnapshot, uploadError] =
    useUploadFile();
  // const storageRef = ref(storage, `users/${user?.user.uid}/profilePhoto/`);
  const [file, setFile] = useState<File>();
  const [filePreviewURL, setFilePreviewURL] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const cancelButtonRef = useRef(null);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEnteredProductTitle(e.target.value);
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setEnteredProductDescription(e.target.value);
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

  // async function handleFileUpload(path: string) {
  //   if (!file) return;

  //   const fileRef = ref(storage, path);
  //   await uploadFile(fileRef, file);
  //   const downloadURL = await getDownloadURL(fileRef);
  //   setFileDownloadURL(downloadURL);
  // }

  if (uploadLoading || isLoading) return <LoadingState />;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      enteredProductTitle === null ||
      enteredProductTitle === "" ||
      (enteredProductTitle!.length < 2 && enteredProductTitle!.length > 50)
    ) {
      setErrorMessage(
        "Please enter a product title that is greater than 2 characters and less than 50 characters!"
      );
      return;
    }

    if (
      enteredProductDescription === null ||
      enteredProductDescription === "" ||
      enteredProductDescription!.length > 500
    ) {
      setErrorMessage(
        "Please enter a product description that is less than 500 characters!"
      );
      return;
    }

    if (!file) {
      setErrorMessage("Please select a file.");
      return;
    }

    setIsLoading(true);

    const newProductId = uuidv4();

    let newProduct = {
      id: newProductId,
      title: enteredProductTitle,
      description: enteredProductDescription,
      imageURL: "",
      rates: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
      },
      ratesCount: 0,
    };

    // await handleFileUpload(`organizations/${orgId}/products/${newProductId}`);

    const storageRef = ref(
      storage,
      `organizations/${orgId}/products/${newProductId}/productImage`
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
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            // console.log("File available at", downloadURL);

            newProduct = {
              ...newProduct,
              imageURL: downloadURL,
            };
          })
          .then(() => {
            const orgDoc = doc(db, "organizations", orgId);

            getDoc(orgDoc)
              .then((orgSnapshot) => {
                if (!orgSnapshot.exists()) {
                  setErrorMessage("Organization doesn't exist!");
                  return;
                }

                updateDoc(orgDoc, {
                  products: arrayUnion(newProduct),
                });

                const orgData = orgSnapshot.data();

                router.push(
                  `/products/${orgData.name.toLowerCase().replace(/\s/g, "")}`
                );
              })
              .catch((error: any) => {
                setErrorMessage(error.message);
              });
          });
      }
    );

    setIsLoading(false);
    setEnteredProductTitle("");
    setEnteredProductDescription("");
    setFile(undefined);
    setErrorMessage("");
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={cancelButtonRef}
        onClose={closeModal}
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

        <div className="fixed inset-0 z-20 overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden bg-background--white rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg px-4 pt-5 pb-4 sm:p-6 sm:pb-5">
                <div className="flex flex-col justify-center items-center gap-y-4">
                  <h1 className="heading text-center">Add a product</h1>
                  <form
                    onSubmit={handleSubmit}
                    className="form bg-white gap-y-3 lg:gap-y-4 mt-4 lg:mt-6 w-full"
                  >
                    {errorMessage && (
                      <p className="paragraph text-error--red text-center">
                        {errorMessage}
                      </p>
                    )}
                    <Input
                      label="Product Title"
                      id="product-title"
                      name="product-title"
                      type="text"
                      value={enteredProductTitle}
                      placeholder="e.g. Product 1"
                      onChange={handleTitleChange}
                    />
                    <TextArea
                      label="Product Description"
                      id="product-description"
                      name="product-description"
                      value={enteredProductDescription}
                      placeholder="e.g. This is a product..."
                      onChange={handleDescriptionChange}
                    />
                    <FileInput
                      label="Product Image"
                      onChange={handleFileChange}
                      id="product-image"
                      name="product-image"
                      filePreviewURL={filePreviewURL}
                    />
                    <div className="mt-4 lg:mt-6 flex flex-col lg:flex-row-reverse justify-center items-center lg:items-end w-full lg:gap-x-3">
                      <button
                        type="submit"
                        className="button-blue duration-300"
                        onClick={() => {
                          if (!errorMessage) {
                            closeModal();
                          }
                        }}
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        className="button-blue mt-3 lg:mt-4 bg-background--white text-primary--blue hover:bg-primary--blue hover:text-background--white duration-300"
                        onClick={() => {
                          closeModal();
                          setEnteredProductTitle("");
                          setEnteredProductDescription("");
                          setFile(undefined);
                          setFilePreviewURL("");
                          setErrorMessage("");
                        }}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
