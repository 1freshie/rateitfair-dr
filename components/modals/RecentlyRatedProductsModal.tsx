import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import RecentlyRatedProductCard from "../cards/RecentlyRatedProductCard";

interface RecentlyRatedProductsModalProps {
  ratedProducts: {
    orgId: string;
    // orgName: string;
    productId: string;
    comment: string;
    // productTitle: string;
    // productImageURL: string;
    rate: number;
    ratedAt: string;
  }[];
  isOpen: boolean;
  closeModal: () => void;
}

export default function RecentlyRatedProductsModal({
  ratedProducts,
  isOpen,
  closeModal,
}: RecentlyRatedProductsModalProps) {
  const closeButtonRef = useRef(null);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={closeButtonRef}
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
                <div className="flex flex-col justify-center items-center gap-y-6">
                  <h1 className="heading text-center">
                    Recently rated produts
                  </h1>
                  {ratedProducts.length > 0 ? (
                    <div className="w-full flex flex-col justify-center items-center gap-y-4">
                      {ratedProducts.map((ratedProduct) => (
                        <RecentlyRatedProductCard
                          key={ratedProduct.productId}
                          orgId={ratedProduct.orgId}
                          productId={ratedProduct.productId}
                          comment={ratedProduct.comment}
                          rate={ratedProduct.rate}
                          ratedAt={ratedProduct.ratedAt}
                        />
                      ))}
                    </div>
                  ) : (
                    <em className="small-paragraph text-center">
                        No rated products yet...
                        <br />
                        <span className="text-secondary--orange">Rate some products to see them here!</span>
                    </em>
                  )}
                  <button
                    className="button-blue duration-300"
                    onClick={closeModal}
                    ref={closeButtonRef}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
