import { faList, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface RoleActivityButtonProps {
  userRole: string;
  openModal: () => void;
}

export default function RoleActivityButton({
  userRole,
  openModal,
}: RoleActivityButtonProps) {
  return (
    <div
      onClick={openModal}
      className="w-full lg:w-[500px] p-6 mt-8 flex justify-between items-center font-medium paragraph text-secondary--gray border border-secondary--gray rounded-2xl duration-300 hover:text-primary--blue hover:border-primary--blue cursor-pointer"
    >
      {userRole === "Admin" && (
        <>
          <p>Add a new organization...</p>
          <FontAwesomeIcon
            icon={faPlus}
            className="w-6 md:w-7 lg:w-8 xl:w-9 h-6 md:h-7 lg:h-8 xl:h-9"
          />
        </>
      )}
      {userRole !== "User" && userRole !== "Admin" && (
        <>
          <p>Add a new product...</p>
          <FontAwesomeIcon
            icon={faPlus}
            className="w-6 md:w-7 lg:w-8 xl:w-9 h-6 md:h-7 lg:h-8 xl:h-9"
          />
        </>
      )}
      {userRole === "User" && (
        <>
          <p>Recently rated products...</p>
          <FontAwesomeIcon
            icon={faList}
            className="w-6 md:w-7 lg:w-8 xl:w-9 h-6 md:h-7 lg:h-8 xl:h-9"
          />
        </>
      )}
    </div>
  );
}
