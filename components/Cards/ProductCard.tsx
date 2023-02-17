import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  query,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebaseApp";
import AuthState from "../AuthState/AuthState";
import LoadingSpinner from "../States/LoadingSpinner";
import SelectedUserCard from "./SelectedUserCard";

interface ProductCardProps {
  orgId: string;
  orgSlug: string;
  id: string;
  title: string;
  ratesCount: number;
  imageURL: string;
  isAdminOrOrg: boolean;
  deleteProduct: (id: string) => void;
}

export default function ProductCard({
  orgId,
  orgSlug,
  id,
  title,
  ratesCount,
  imageURL,
  isAdminOrOrg,
  deleteProduct,
}: ProductCardProps) {
  const [user, loading, error] = useAuthState(auth);

  const router = useRouter();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cancelButtonRef = useRef(null);

  async function handleDeleteProduct(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    setIsLoading(true);

    const orgRef = doc(collection(db, "organizations"), orgId);

    const orgDoc = await getDoc(orgRef);

    const orgData = orgDoc.data() as DocumentData;

    const products = orgData.products.filter(
      (product: DocumentData) => product.id !== id
    );

    await updateDoc(orgRef, {
      products,
    });

    const userRef = doc(collection(db, "users"), user!.uid);

    const userDoc = await getDoc(userRef);

    const userData = userDoc.data() as DocumentData;

    const ratedProducts = userData.ratedProducts.filter(
      (product: DocumentData) => product.productId !== id
    );

    await updateDoc(userRef, {
      ratedProducts,
    });

    deleteProduct(id);

    setIsLoading(false);
    setShowConfirmation(false);
    // router.reload();
  }

  if (loading || error) {
    return <AuthState />;
  }

  if (isLoading) {
    return (
      <div className="flex h-96 flex-1 justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Link href={`/products/${orgSlug}/${id}`}>
      <div className="relative flex flex-col items-center justify-around w-60 h-72 md:w-64 md:h-80 lg:w-72 lg:h-96 p-2 cursor-pointer border-2 rounded-2xl duration-300 border-secondary--orange hover:border-primary--orange z-0">
        {isAdminOrOrg && (
          <>
            <FontAwesomeIcon
              icon={faXmark}
              onClick={(e: React.MouseEvent<SVGSVGElement>) => {
                e.preventDefault();
                setShowConfirmation(true);
              }}
              className="absolute top-2 right-2 w-5 h-5 text-primary--orange hover:text-error--red duration-300 cursor-pointer"
            />
            <Transition.Root show={showConfirmation} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-20"
                initialFocus={cancelButtonRef}
                onClose={() => setShowConfirmation(false)}
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
                            Are you sure you want to entirely delete this
                            product{" "}
                            <span className="text-primary--blue">{title}</span>?
                            <br />
                            This includes all the rates and comments.
                            <br />
                            <span className="text-secondary--orange">
                              This action cannot be undone!
                            </span>
                          </p>
                          <div className="flex flex-col lg:flex-row-reverse justify-center items-center lg:items-end w-full lg:gap-x-3">
                            <button
                              className="button-blue duration-300"
                              onClick={handleDeleteProduct}
                            >
                              Delete
                            </button>
                            <button
                              className="button-blue mt-3 lg:mt-4 bg-background--white text-primary--blue  hover:bg-primary--blue hover:text-background--white duration-300"
                              onClick={(
                                e: React.MouseEvent<HTMLButtonElement>
                              ) => {
                                e.preventDefault();
                                setShowConfirmation(false);
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
          </>
        )}
        <Image
          src={imageURL}
          width={128}
          height={128}
          alt={title}
          className="w-auto h-auto"
        />
        <h1 className="paragraph w-11/12 text-primary--blue font-medium text-center">
          {title}
        </h1>
        <div className="w-full flex flex-col justify-center items-center text-center">
          <p className="small-paragraph text-secondary--orange">
            <span className="font-medium">7</span>/10
          </p>
          <p className="small-paragraph">
            {"("}
            <span className="font-medium">{ratesCount}</span> total rates{")"}
          </p>
        </div>
        <button className="duration-300 button-orange">
          {isAdminOrOrg ? "View" : "Rate it"}
        </button>
      </div>
    </Link>
  );
}
