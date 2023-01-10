import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../../firebase/firebaseApp";

export default function NavState() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>  
      {user ? (
        <>
          <li className="duration-300 hover:text-primary--orange">
            <Link href="/products">Products</Link>
          </li>
          <li className="duration-300 hover:text-primary--orange">
            <Link href={`/profile/${user.uid}`}>Profile</Link>
          </li>
        </>
      ) : (
        <>
          <li className="duration-300 hover:text-primary--orange">
            <Link href="/login">Login</Link>
          </li>
          <li className="duration-300 hover:text-primary--orange">
            <Link href="/signup">Sign up</Link>
          </li>
        </>
      )}
      {error && (
        <>
          <li className="duration-300 hover:text-primary--orange">
            <Link href="/login">Login</Link>
          </li>
          <li className="duration-300 hover:text-primary--orange">
            <Link href="/signup">Sign up</Link>
          </li>
        </>
      )}
      {loading && <></>}
    </>
  );
}
