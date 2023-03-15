import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../../firebaseApp";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";

interface ProductCardProps {
  orgId: string;
  orgSlug: string;
  id: string;
  title: string;
  rates: {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
  };
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
  rates,
  ratesCount,
  imageURL,
  isAdminOrOrg,
  deleteProduct,
}: ProductCardProps) {
  const [user, loading, error] = useAuthState(auth);

  const router = useRouter();

  const [averageRate, setAverageRate] = useState(0);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cancelButtonRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);

    function getAverageRate() {
      let sum = 0;
      let count = 0;

      for (const [key, value] of Object.entries(rates)) {
        if (value > 0) {
          sum += Number(key) * value;
          count += value;
        }
      }

      let average = count > 0 ? sum / count : 0;

      setAverageRate(Math.round(average * 10) / 10);
    }

    getAverageRate();

    setIsLoading(false);
  }, [user]);

  async function handleDeleteProduct(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    deleteProduct(id);

    setShowConfirmation(false);
  }

  if (error) {
    return <ErrorState error={error.message} />;
  }

  if (loading || isLoading) {
    return <LoadingState />;
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

        <div className="w-24 h-24 lg:w-32 lg:h-32">
          <Image
            src={imageURL}
            width={128}
            height={128}
            alt={title}
            className="w-full h-full"
          />
        </div>
        <h1 className="paragraph w-11/12 text-primary--blue font-medium text-center">
          {title}
        </h1>
        <div className="w-full flex flex-col justify-center items-center text-center">
          <p className="small-paragraph text-secondary--orange">
            An average of
          </p>
          <div className="flex justify-center items-center text-center gap-x-1">
            <p className="small-paragraph text-secondary--orange">
              <strong>{averageRate}</strong>/10
            </p>
            <StarIcon
              fill="none"
              stroke="#f9ab55"
              className="w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 text-primary--orange"
            />
          </div>
          <p className="small-paragraph">
            {"("}
            <strong>{ratesCount}</strong> total rates so far...)
          </p>
        </div>
        <button className="duration-300 button-orange">
          {isAdminOrOrg ? "View" : "Rate it"}
        </button>
      </div>
    </Link>
  );
}
