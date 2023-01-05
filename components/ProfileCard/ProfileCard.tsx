'use client';

import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

import { faEnvelope, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOutUser } from '../../context/auth-context';
import { auth } from '../../firebase/firebaseApp';
import AuthState from '../AuthState/AuthState';

const iconStyle = {
  width: '20px',
  height: '20px',
  color: '#909CC2',
};

const ProfileCard: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  // console.log(user?.photoURL);

  const handleSignOut = async () => {
    await signOutUser();
    router.push('/');
  };

  if (loading || error) {
    return <AuthState />;
  }

  return (
    <div className="w-[350px] lg:w-[500px] flex flex-col justify-center items-center border border-primary--blue rounded-[30px] p-6">
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
      <div className="w-5/6 flex flex-col lg:flex-row items-center justify-between mt-6">
        <FontAwesomeIcon icon={faEnvelope} style={iconStyle} />
        <p className="paragraph text-secondary--gray p-1">
          {user?.email || ''}
        </p>
      </div>
      <div className="w-5/6 flex flex-col lg:flex-row items-center justify-between">
        <FontAwesomeIcon icon={faStar} style={iconStyle} />
        <p className="paragraph text-secondary--gray">
          9999 rated products
        </p>
      </div>
      <button
        onClick={handleSignOut}
        className="button mt-5 md:mt-7 duration-300 hover:bg-secondary--orange"
      >
        Sign out
      </button>
    </div>
  );
};

export default ProfileCard;
