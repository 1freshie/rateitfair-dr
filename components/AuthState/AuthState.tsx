'use client';

import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../../firebase/firebaseApp';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const AuthState: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex h-96 flex-1 justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 flex-1 justify-center items-center">
        <p className="paragraph text-center text-error--red">{error.message}</p>
      </div>
    );
  }

  return <></>;
};

export default AuthState;
