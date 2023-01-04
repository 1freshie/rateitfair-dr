'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebaseApp';

const ProfileCard: React.FC = () => {
  const [user] = useAuthState(auth);

  console.log(user?.photoURL);

  return (
    <div className="h-2/3 flex flex-col flex-1 justify-center items-center border border-primary--blue rounded-[30px] p-6">
      <div className="flex flex-col justify-center items-center">
        <img
          src={user?.photoURL || 'https://via.placeholder.com/110'}
          alt="Profile Photo"
          width={110}
          height={110}
          className="rounded-full object-center object-cover"
        />
        <h1 className="heading mt-3">{user?.displayName}</h1>
        <p className="paragraph mt-2">User | Organization | Admin</p>
      </div>
      <div className="flex flex-col justify-center items-center mt-6 space-y-1">
        <span className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            aria-label="Email address"
            className="w-4 h-4 text-secondary--gray"
          >
            <path
              fill="currentColor"
              d="M274.6,25.623a32.006,32.006,0,0,0-37.2,0L16,183.766V496H496V183.766ZM464,402.693,339.97,322.96,464,226.492ZM256,51.662,454.429,193.4,311.434,304.615,256,268.979l-55.434,35.636L57.571,193.4ZM48,226.492,172.03,322.96,48,402.693ZM464,464H48V440.735L256,307.021,464,440.735Z"
            ></path>
          </svg>
          <span className="paragraph text-secondary--gray">{user?.email}</span>
        </span>
      </div>
    </div>
  );
};

export default ProfileCard;
