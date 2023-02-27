import { uuidv4 } from "@firebase/util";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { validateImage } from "image-validator";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import { useUploadFile } from "react-firebase-hooks/storage";

import { db, storage } from "../../firebaseApp";
import SelectedUserCard from "../cards/SelectedUserCard";
import FileInput from "../inputs/FileInput";
import Input from "../inputs/Input";

interface AddOrganizationModalProps {
  availableUsers: DocumentData[];
  isOpen: boolean;
  closeModal: () => void;
}

// TODO: When adding users to an organization, set the users orgId to the orgId of the organization they are being added to
// and their role to the organization's name

export default function AddOrganizationModal({
  availableUsers,
  isOpen,
  closeModal,
}: AddOrganizationModalProps) {
  const router = useRouter();

  const [enteredOrgName, setEnteredOrgName] = useState("");

  const [uploadFile, uploadLoading, uploadSnapshot, uploadError] =
    useUploadFile();
  const [file, setFile] = useState<File>();
  const [filePreviewURL, setFilePreviewURL] = useState("");
  const [fileDownloadURL, setFileDownloadURL] = useState("");

  const [availableUsersForSelection, setAvailableUsersForSelection] =
    useState(availableUsers);
  const [filteredUsers, setFilteredUsers] = useState(availableUsers);
  const [selectedUsers, setSelectedUsers] = useState<DocumentData[]>([]);
  const [selectedUser, setSelectedUser] = useState<DocumentData | null>(null);
  const [query, setQuery] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      setSelectedUsers((prevSelectedUsers) => {
        const newSelectedUsers = [...prevSelectedUsers, selectedUser];
        return newSelectedUsers;
      });

      setAvailableUsersForSelection((prevAvailableUsers) => {
        const newAvailableUsers = prevAvailableUsers.map((user) => {
          if (user.id === selectedUser.id) {
            return { ...user, isAvailable: false };
          }
          return user;
        });
        // const newAvailableUsers = prevAvailableUsers.filter(
        //   (user) => user.id !== selectedUser.id
        // );

        return newAvailableUsers;
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    setFilteredUsers((prevFilteredUsers) => {
      let newFilteredUsers = prevFilteredUsers;

      if (query !== "") {
        newFilteredUsers = prevFilteredUsers.filter((user) =>
          user.email
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
      } else {
        newFilteredUsers = availableUsersForSelection;
      }

      return newFilteredUsers;
    });
  }, [query, availableUsersForSelection]);

  console.log(selectedUsers);

  function handleUserSelectionRemoval(userId: string) {
    setSelectedUsers((prevSelectedUsers) => {
      const newSelectedUsers = prevSelectedUsers.filter(
        (user) => user.id !== userId
      );
      return newSelectedUsers;
    });

    setAvailableUsersForSelection((prevAvailableUsers) => {
      const newAvailableUsers = prevAvailableUsers.map((user) => {
        if (user.id === userId) {
          return { ...user, isAvailable: true };
        }
        return user;
      });
      return newAvailableUsers;
    });

    // setSelectedUser(null);
  }

  function handleOrgNameChange(e: ChangeEvent<HTMLInputElement>) {
    setEnteredOrgName(e.target.value);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : undefined;
    // console.log(file?.size)
    if (file === undefined) return;

    if (file.size > 10000000) {
      setError("File size is too large.");
      return;
    }

    const isValidImage = await validateImage(file);

    if (!isValidImage) {
      setError("File is not an image.");
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !enteredOrgName ||
      enteredOrgName === "" ||
      (enteredOrgName!.length < 2 && enteredOrgName!.length > 50) ||
      enteredOrgName === "Admin" ||
      enteredOrgName === "admin" ||
      enteredOrgName === "ADMIN" ||
      enteredOrgName === "User" ||
      enteredOrgName === "user" ||
      enteredOrgName === "USER"
    ) {
      setError(
        "Please enter a valid organization name that is greater than 2 characters and less than 50 characters!"
      );
      return;
    }

    // if (selectedUsers.length === 0) {
    //   setError("Please select at least one user to add to the organization!");
    //   return;
    // }

    if (!file) {
      setError("Please select a logo for the organization!");
      return;
    }

    setIsLoading(true);

    const newOrgId = uuidv4();

    let newOrg = {
      id: newOrgId,
      name: enteredOrgName,
      logoURL: "",
      users: selectedUsers.map((user) => {
        return {
          id: user.id,
          username: user.username,
          email: user.email,
        };
      }),
    };

    // await handleFileUpload(`organizations/${newOrgId}/logo`);

    const storageRef = ref(storage, `organizations/${newOrgId}/logo`);

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
        setError(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("File available at", downloadURL);

            newOrg = {
              ...newOrg,
              logoURL: downloadURL,
            };
          })
          .then(() => {
            const newOrgDoc = doc(db, "organizations", newOrgId);

            setDoc(newOrgDoc, newOrg)
              .then(() => {
                selectedUsers.forEach((user) => {
                  const userDoc = doc(db, "users", user.id);

                  updateDoc(userDoc, {
                    orgId: newOrgId,
                    role: enteredOrgName,
                  });
                });

                router.push("/orgs");
              })
              .catch((error: any) => {
                setError(error.message);
              });
          })
          .catch((error: any) => {
            setError(error.message);
          });
      }
    );

    // const newOrg = {
    //   id: newOrgId,
    //   name: enteredOrgName,
    //   logoURL: fileDownloadURL,
    //   users: selectedUsers.map((user) => {
    //     return {
    //       id: user.id,
    //       username: user.username,
    //       email: user.email,
    //     };
    //   }),
    // };

    // const orgsCollection = collection(db, "organizations");

    // const newOrgDoc = doc(orgsCollection, newOrgId);

    // try {
    //   await setDoc(newOrgDoc, newOrg);
    // } catch (error: any) {
    //   prompt("Error", error.message);
    // }

    // selectedUsers.forEach(async (user) => {
    //   const usersCollection = collection(db, "users");

    //   const userDoc = doc(usersCollection, user.id);

    //   try {
    //     await updateDoc(userDoc, {
    //       orgId: newOrgId,
    //       role: enteredOrgName,
    //     });
    //   } catch (error: any) {
    //     prompt("Error", error.message);
    //   }
    // });

    // closeModal();

    setIsLoading(false);
    setEnteredOrgName("");
    setFile(undefined);
    setSelectedUsers([]);
    setError("");
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-background--white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg px-4 pt-5 pb-4 sm:p-6 sm:pb-5">
                <div className="flex flex-col justify-center items-center gap-y-4">
                  <h1 className="heading text-center">Add an organization</h1>
                  <form
                    onSubmit={handleSubmit}
                    className="form bg-white gap-y-3 lg:gap-y-4 mt-4 lg:mt-6 w-full"
                  >
                    {error && (
                      <p className="paragraph text-error--red text-center">
                        {error}
                      </p>
                    )}
                    <Input
                      label="Organization Name"
                      id="org-name"
                      name="org-name"
                      type="text"
                      value={enteredOrgName}
                      placeholder="e.g. Company 1"
                      onChange={handleOrgNameChange}
                    />
                    <FileInput
                      label="Organization Logo"
                      onChange={handleFileChange}
                      id="org-logo"
                      name="org-logo"
                      filePreviewURL={filePreviewURL}
                    />

                    {/* <textarea
                      placeholder="Select users for this organization..."
                      className="input resize-none h-44 md:h-48 lg:h-52 xl:h-56"
                    /> */}

                    <p className="small-paragraph text-center">
                      Select users for this organization...
                    </p>
                    <div className="w-full">
                      <Combobox value={selectedUser} onChange={setSelectedUser}>
                        <div className="relative mt-1">
                          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-[#FFFFFF] text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF] focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary--orange sm:text-sm">
                            <Combobox.Input
                              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-primary--blue focus:ring-0 z-30"
                              displayValue={(user: DocumentData) =>
                                user ? user.email : ""
                              }
                              onChange={(event) => setQuery(event.target.value)}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon
                                className="h-5 w-5 text-secondary--blue"
                                aria-hidden="true"
                              />
                            </Combobox.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setQuery("")}
                          >
                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#FFFFFF] py-1 text-base shadow-lg ring-1 ring-[#000000] ring-opacity-5 focus:outline-none sm:text-sm z-30">
                              {filteredUsers?.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-primary--blue">
                                  Nothing found.
                                </div>
                              ) : (
                                filteredUsers?.map((user) => (
                                  <Combobox.Option
                                    key={user.id}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active
                                          ? "bg-primary--orange text-background--white"
                                          : "text-secondary--gray"
                                      } ${user.isAvailable ? "" : "opacity-50"}`
                                    }
                                    value={user}
                                    disabled={!user.isAvailable}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={`flex items-center gap-x-2 truncate ${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          }`}
                                        >
                                          <Image
                                            src={
                                              user.photoURL
                                                ? user.photoURL
                                                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                            }
                                            width={18}
                                            height={18}
                                            alt="Profile Photo"
                                            className="rounded-full w-auto h-auto"
                                          />
                                          {`${user.username} (${user.email})`}
                                        </span>
                                        {selected ? (
                                          <span
                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                              active
                                                ? "text-background--white"
                                                : "text-secondary--orange"
                                            }`}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))
                              )}
                            </Combobox.Options>
                          </Transition>
                        </div>
                      </Combobox>
                    </div>

                    {selectedUser && selectedUsers.length > 0 && (
                      <div className="input w-full h-full flex flex-col gap-2">
                        {selectedUsers.map((user) => (
                          <SelectedUserCard
                            key={user.id}
                            userId={user.id}
                            username={user.username}
                            userEmail={user.email}
                            removeSelectedUser={handleUserSelectionRemoval}
                          />
                        ))}
                      </div>
                    )}

                    <div className="mt-4 lg:mt-6 flex flex-col lg:flex-row-reverse justify-center items-center lg:items-end w-full lg:gap-x-3">
                      <button
                        type="submit"
                        className="button-blue duration-300"
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
                        className="button-blue mt-3 lg:mt-4 bg-background--white text-primary--blue  hover:bg-primary--blue hover:text-background--white duration-300"
                        onClick={() => {
                          closeModal();
                          setEnteredOrgName("");
                          setFile(undefined);
                          setFilePreviewURL("");
                          setSelectedUser(null);
                          setSelectedUsers([]);
                          setAvailableUsersForSelection(
                            (prevAvailableUsers) => {
                              return prevAvailableUsers.map((user) => {
                                return {
                                  ...user,
                                  isAvailable: true,
                                };
                              });
                            }
                          );
                          setError("");
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
