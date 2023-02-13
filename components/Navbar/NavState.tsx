import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
} from "firebase/firestore";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "../../firebase/firebaseApp";
import AuthState from "../AuthState/AuthState";

export default function NavState() {
  const [user, loading, error] = useAuthState(auth);

  const [isLoading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [orgs, setOrgs] = useState<DocumentData[]>([]);

  useEffect(() => {
    setIsLoading(true);
    async function getOrgs() {
      const orgsCollection = collection(db, "organizations");

      const orgsSnapshot = await getDocs(orgsCollection);

      const orgsData = orgsSnapshot.docs.map((doc) => doc.data());

      setOrgs(orgsData);
    }

    getOrgs();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    async function getUserData() {
      if (user) {
        const userDoc = doc(db, "users", user.uid);

        const userDocSnapshot = await getDoc(userDoc);

        const currUserData = userDocSnapshot.data() as DocumentData;

        setUserData(currUserData);

        if (
          currUserData.role !== "User" &&
          currUserData.role !== "Admin" &&
          currUserData.orgId.length > 0
        ) {
          setOrgName(currUserData.role);
          setOrgSlug(currUserData.role.toLowerCase().replace(/\s/g, ""));
        }
      }
    }

    getUserData();
    setIsLoading(false);
  }, [user]);

  return (
    <>
      {user ? (
        <>
          <li>
            {userData?.orgId && (
              // <Link
              //   href={`/products/${orgSlug}`}
              //   className="duration-300 hover:text-primary--orange"
              // >
              //   Our products
              // </Link>

              <Menu as="div" className="relative inline-block text-center z-20">
                <div>
                  <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 duration-300 hover:text-primary--orange">
                    {orgName}
                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute left-1/2 transform -translate-x-1/2 w-48 lg:w-60 mt-2 origin-top-right divide-y divide-secondary--orange rounded-xl shadow-lg ring-1 ring-primary--orange ring-opacity-5 focus:outline-none paragraph bg-background--white z-50">
                    <div className="p-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`/products/${orgSlug}`}
                            className={`small-paragraph ${
                              active
                                ? "bg-primary--orange text-background--white"
                                : "text-primary--orange"
                            } group flex rounded-md items-center w-full px-2 py-2`}
                          >
                            Our products
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`/orgs/${orgSlug}`}
                            className={`small-paragraph ${
                              active
                                ? "bg-primary--orange text-background--white"
                                : "text-primary--orange"
                            } group flex rounded-md items-center w-full px-2 py-2`}
                          >
                            Our org
                          </Link>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}

            {!userData?.orgId && userData?.role === "User" && (
              // IMPORTANT: THE NAVBAR AND THE PROFILE PAGE ARE RELATIVE AND MAKE CONFLICT! TO FIX THAT!!!
              <Menu as="div" className="relative inline-block text-center z-20">
                <div>
                  <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 duration-300 hover:text-primary--orange">
                    Products
                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute left-1/2 transform -translate-x-1/2 w-48 lg:w-60 mt-2 origin-top-right divide-y divide-secondary--orange rounded-xl shadow-lg ring-1 ring-primary--orange ring-opacity-5 focus:outline-none paragraph bg-background--white z-[1000]">
                    <div className="p-1">
                      {orgs.map((org) => (
                        <Menu.Item key={org.id}>
                          {({ active }) => (
                            <Link
                              href={`/products/${org.name
                                .toLowerCase()
                                .replace(/\s/g, "")}`}
                              // href={`/products/${org.id}`}
                              className={`small-paragraph ${
                                active
                                  ? "duration-300 bg-primary--orange text-background--white"
                                  : "text-primary--orange"
                              } group flex rounded-md items-center w-full px-2 py-2`}
                            >
                              {org.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}

            {!userData?.orgId && userData?.role === "Admin" && (
              <Link
                href="/orgs"
                className="duration-300 hover:text-primary--orange"
              >
                Organizations
              </Link>
            )}
          </li>
          <li className="duration-300 hover:text-primary--orange">
            <Link href={`/profile/${userData?.id}`}>Profile</Link>
          </li>
        </>
      ) : (
        <>
          <li className="duration-300 hover:text-primary--orange">
            <Link href="/login">Login</Link>
          </li>
          <li className="duration-300 hover:text-primary--orange">
            <Link href="/signup">Sign up</Link>
          </li>
        </>
      )}
      {loading || (isLoading && <></>)}
      {error && (
        <>
          <li className="duration-300 hover:text-primary--orange">
            <Link href="/login">Login</Link>
          </li>
          <li className="duration-300 hover:text-primary--orange">
            <Link href="/signup">Sign up</Link>
          </li>
        </>
      )}
    </>
  );
}
