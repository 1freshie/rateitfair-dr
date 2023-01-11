import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";

interface AddProductFormProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function AddProductForm({
  isOpen,
  closeModal,
}: AddProductFormProps) {
  const cancelButtonRef = useRef(null);

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
                    Add a product
                  </h1>
                  <form className="form bg-white gap-y-3 lg:gap-y-4 mt-4 lg:mt-6 w-full">
                    <input
                      type="text"
                      placeholder="Enter a product title..."
                      className="input"
                    />
                    <textarea
                      placeholder="Enter a product description..."
                      className="input resize-none h-44 md:h-48 lg:h-52 xl:h-56"
                    />
                    <input
                      type="text"
                      placeholder="Enter a product image URL..."
                      className="input"
                    />
                  </form>
                </div>
                <div className="mt-4 lg:mt-6 flex flex-col lg:flex-row-reverse justify-center items-center lg:items-end w-full lg:gap-x-3">
                  <button
                    type="submit"
                    className="button-orange duration-300"
                    onClick={closeModal}
                  >
                    Add
                  </button>
                  <button
                    className="button-orange mt-3 lg:mt-4 bg-background--white text-primary--orange hover:bg-primary--orange hover:text-background--white duration-300"
                    onClick={closeModal}
                    ref={cancelButtonRef}
                  >
                    Cancel
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
