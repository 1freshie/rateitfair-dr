'use client';

import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../../firebase/firebaseApp';

const NavState = () => {
  const [user] = useAuthState(auth);

  return (
    <>
      {user ? (
          <>
            <li className="duration-300 hover:text-primary--orange">
              <Link href="/login">Products</Link>
            </li>
            <li className="duration-300 hover:text-primary--orange">
              <Link href="/signup">Profile</Link>
            </li>
          </>
        ) : (
          <>
            <li className="duration-300 hover:text-primary--orange">
              <Link href="/login">Login</Link>
            </li>
            <li className="duration-300 hover:text-primary--orange">
              <Link href="/signup">Sign Up</Link>
            </li>
          </>
        )}
    </>
  );
};

export default NavState;
