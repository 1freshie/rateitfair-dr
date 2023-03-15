import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SelectedUserCardProps {
  userId: string;
  username: string;
  userEmail: string;
  removeSelectedUser: (userId: string) => void;
}

export default function SelectedUserCard({
  userId,
  username,
  userEmail,
  removeSelectedUser,
}: SelectedUserCardProps) {
  return (
    <div className="flex justify-between items-center border border-primary--blue rounded-xl p-2 gap-x-2">
      <p className="text-xs text-primary--blue">{`${username} (${userEmail})`}</p>
      <FontAwesomeIcon
        icon={faXmark}
        onClick={(e) => removeSelectedUser(userId)}
        className="w-4 h-4 text-primary--blue cursor-pointer"
      />
    </div>
  );
}
