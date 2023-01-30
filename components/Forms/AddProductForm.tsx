import { uuidv4 } from "@firebase/util";
import { Dialog, Transition } from "@headlessui/react";
import {
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { validateImage } from "image-validator";
import { useRouter } from "next/router";
import React, { Fragment, useRef, useState } from "react";

import { db } from "../../firebase/firebaseApp";

interface AddProductFormProps {
  orgId: string;
  orgData?: DocumentData;
  isOpen: boolean;
  closeModal: () => void;
}

export default function AddProductForm({
  orgId,
  isOpen,
  closeModal,
}: AddProductFormProps) {
  const [enteredProductTitle, setEnteredProductTitle] = useState<string | null>(
    null
  );
  const [enteredProductDescription, setEnteredProductDescription] = useState<
    string | null
  >(null);
  const [enteredProductImageURL, setEnteredProductImageURL] = useState<
    string | null
  >(null);

  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // const productTitleInputRef = useRef<HTMLInputElement>(null);
  // const productDescriptionInputRef = useRef<HTMLTextAreaElement>(null);
  // const productImageURLInputRef = useRef<HTMLInputElement>(null);

  const cancelButtonRef = useRef(null);

  // async function verifyImageURL(imageURL: string) {
  //   const image = new Image();
  //   image.src = imageURL;
  //   image.onload = () => {
  //     return true;
  //   };
  //   image.onerror = () => {
  //     return false;
  //   };
  // }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      enteredProductTitle === null ||
      enteredProductTitle === "" ||
      (enteredProductTitle!.length < 2 && enteredProductTitle!.length > 50)
    ) {
      setError(
        "Please enter a product title that is greater than 2 characters and less than 50 characters!"
      );
      return;
    }

    if (
      enteredProductDescription === null ||
      enteredProductDescription === "" ||
      enteredProductDescription!.length > 500
    ) {
      setError(
        "Please enter a product description that is less than 500 characters!"
      );
      return;
    }

    const isValidImage = await validateImage(
      enteredProductImageURL === null ? "" : enteredProductImageURL
    );

    if (!isValidImage) {
      setError("Please enter a valid product image URL!");
      return;
    }

    const newProductId = uuidv4();

    const newProduct = {
      id: newProductId,
      title: enteredProductTitle,
      description: enteredProductDescription,
      imageURL: enteredProductImageURL,
      // comments: [],
      // add comments in updateDoc when adding comments
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

    const orgsCollection = collection(db, "organizations");
    const orgDoc = doc(orgsCollection, orgId);

    // get the orgDoc data
    const orgSnapshot = await getDoc(orgDoc);

    if (!orgSnapshot.exists()) {
      prompt("Error", "Organization doesn't exist!");
      return;
    }

    const orgData = orgSnapshot.data();

    try {
      await updateDoc(orgDoc, {
        products: arrayUnion(newProduct),
      });
    } catch (err: any) {
      prompt("Error", err.message);
    }

    setEnteredProductTitle(null);
    setEnteredProductDescription(null);
    setEnteredProductImageURL(null);

    router.push(`/products/${orgData.name.toLowerCase().replace(/\s/g, "")}`);

    setError(null);
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
              <Dialog.Panel className="relative transform overflow-hidden bg-background--white rounded-[30px] bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg px-4 pt-5 pb-4 sm:p-6 sm:pb-5">
                <div className="flex flex-col justify-center items-center">
                  <h1 className="heading mt-4 lg:mt-6 text-center">
                    Add a product
                  </h1>
                  <form
                    onSubmit={handleSubmit}
                    className="form bg-white gap-y-3 lg:gap-y-4 mt-4 lg:mt-6 w-full"
                  >
                    {error && (
                      <p className="paragraph text-error--red text-center">
                        {error}
                      </p>
                    )}
                    <input
                      type="text"
                      placeholder="Enter a product title..."
                      className="input"
                      // ref={productTitleInputRef}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEnteredProductTitle(e.target.value)
                      }
                    />
                    <textarea
                      placeholder="Enter a product description..."
                      className="input resize-none h-44 md:h-48 lg:h-52 xl:h-56"
                      // ref={productDescriptionInputRef}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setEnteredProductDescription(e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="Enter a product image URL..."
                      className="input"
                      // ref={productImageURLInputRef}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEnteredProductImageURL(e.target.value)
                      }
                    />
                    <div className="mt-4 lg:mt-6 flex flex-col lg:flex-row-reverse justify-center items-center lg:items-end w-full lg:gap-x-3">
                      <button
                        type="submit"
                        className="button-orange duration-300"
                        onClick={() => {
                          if (!error) {
                            closeModal();
                          }
                        }}
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        className="button-orange mt-3 lg:mt-4 bg-background--white text-primary--orange hover:bg-primary--orange hover:text-background--white duration-300"
                        onClick={() => {
                          closeModal();
                          setEnteredProductTitle(null);
                          setEnteredProductDescription(null);
                          setEnteredProductImageURL(null);
                          setError(null);
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
