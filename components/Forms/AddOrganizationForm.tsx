import { uuidv4 } from "@firebase/util";
import { Dialog, Transition } from "@headlessui/react";
import { collection, doc, setDoc } from "firebase/firestore";
import React, { Fragment, useRef, useState } from "react";
import { db } from "../../firebase/firebaseApp";

interface AddOrganizationFormProps {
  isOpen: boolean;
  closeModal: () => void;
}

// TODO: When adding users to an organization, set the users orgId to the orgId of the organization they are being added to
// and their role to the organization's name

export default function AddOrganizationForm({
  isOpen,
  closeModal,
}: AddOrganizationFormProps) {
  const [error, setError] = useState<string | null>(null);

  const orgNameInputRef = useRef<HTMLInputElement>(null);
  const cancelButtonRef = useRef(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      orgNameInputRef.current!.value === "" ||
      (orgNameInputRef.current!.value.length < 2 &&
        orgNameInputRef.current!.value.length > 50)
    ) {
      setError(
        "Please enter an organization name that is greater than 2 characters and less than 50 characters!"
      );
      return;
    }

    const newOrgId = uuidv4();

    const newOrg = {
      id: newOrgId,
      name: orgNameInputRef.current!.value,
      // users: [
      //   {
      //     id: "",
      //     email: "",
      //   },
      // ],
    };

    const orgsCollection = collection(db, "organizations");

    try {
      await setDoc(doc(orgsCollection, newOrgId), newOrg);
    } catch (error: any) {
      prompt("Error", error.message);
    }

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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-[30px] bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg px-4 pt-5 pb-4 sm:p-6 sm:pb-5">
                <div className="flex flex-col justify-center items-center">
                  <h1 className="heading mt-4 lg:mt-6 text-center">
                    Add an organization
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
                      placeholder="Enter an organization name..."
                      className="input"
                      ref={orgNameInputRef}
                      // onChange={(e) => {
                      //   setOrgNameInputValue(e.target.value);
                      // }}
                    />
                    <textarea
                      placeholder="Select users for this organization..."
                      className="input resize-none h-44 md:h-48 lg:h-52 xl:h-56"
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
