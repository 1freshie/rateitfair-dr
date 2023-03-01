import Image from "next/image";

interface UserCardProps {
  userId: string;
  username: string;
  userEmail: string;
  userPhotoURL: string;
}

export default function UserCard({
  userId,
  username,
  userEmail,
  userPhotoURL,
}: UserCardProps) {
  return (
    <article className="flex justify-between items-center border border-secondary--gray hover:border-primary--blue duration-300 rounded-xl p-2 gap-x-2">
      <div className="w-8 h-8">
        <Image
          src={
            userPhotoURL
              ? userPhotoURL
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt="User profile photo"
          width={32}
          height={32}
          className="rounded-full w-full h-full"
          priority={true}
        />
      </div>
      <p className="text-xs text-primary--blue">{`${username} (${userEmail})`}</p>
    </article>
  );
}
