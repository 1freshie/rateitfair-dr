import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { title } from "process";
import { Fragment, useEffect, useRef, useState } from "react";

interface OrgCardProps {
  orgId: string;
  orgName: string;
  orgLogoURL: string;
  orgProductsCount: number;
  orgUsersCount: number;
  deleteOrg: (orgId: string) => void;
}

export default function OrgCard({
  orgId,
  orgName,
  orgLogoURL,
  orgProductsCount,
  orgUsersCount,
  deleteOrg,
}: OrgCardProps) {
  const [userOrgSlug, setUserOrgSlug] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (orgName) {
      const orgSlug = orgName.toLowerCase().replace(/\s/g, "");

      setUserOrgSlug(orgSlug);
    }
  }, []);

  function handleDeleteOrg(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    deleteOrg(orgId);

    setShowConfirmation(false);

    // TODO: DELETE ORG FROM STORAGE
  }

  return (
    <Link href={`/orgs/${userOrgSlug}`}>
      <div className="relative w-full flex flex-col justify-center items-center border border-secondary--orange duration-300 hover:border-primary--orange rounded-2xl">
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
                        organization{" "}
                        <span className="text-primary--blue">{orgName}</span>?
                        <br />
                        This includes all org products, users, and data.
                        <br />
                        <span className="text-secondary--orange">
                          This action cannot be undone!
                        </span>
                      </p>
                      <div className="flex flex-col lg:flex-row-reverse justify-center items-center lg:items-end w-full lg:gap-x-3">
                        <button
                          className="button-blue duration-300"
                          onClick={handleDeleteOrg}
                        >
                          Delete
                        </button>
                        <button
                          className="button-blue mt-3 lg:mt-4 bg-background--white text-primary--blue  hover:bg-primary--blue hover:text-background--white duration-300"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
        <div className="w-full p-4 flex flex-col justify-center items-center gap-y-4 border-b border-b-secondary--orange rounded-t-2xl">
          <div className="h-16">
            <Image
              src={orgLogoURL}
              width={64}
              height={64}
              alt="Org Logo"
              className="w-full h-full"
              priority={true}
            />
          </div>
          <h1 className="paragraph w-full text-primary--blue text-center font-medium">{orgName}</h1>
        </div>

        <div className="w-full p-4 flex flex-col justify-center items-center gap-y-4">
          <div className="w-full p-4 flex justify-center items-center gap-x-4">
            <div className="w-full flex flex-col justify-center items-center">
              <h1 className="small-paragraph text-secondary--orange text-center">
                Users
              </h1>
              <p className="paragraph text-secondary--gray font-bold text-center">
                {orgUsersCount}
              </p>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              <h1 className="small-paragraph text-secondary--orange text-center">
                Products
              </h1>
              <p className="paragraph text-secondary--gray font-bold text-center">
                {orgProductsCount}
              </p>
            </div>
          </div>
          <button className="duration-300 button-orange">To org</button>
        </div>
      </div>
    </Link>
  );
}
