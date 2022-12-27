'use client';

import { useRouter } from 'next/navigation';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { signInWithGoogle } from '../../context/auth-context';

const SignInWithGoogle: React.FC = () => {
  const router = useRouter();

  const handleSignIn = async () => {
    await signInWithGoogle();
    router.push('/');
  };

  return (
    <button
      onClick={handleSignIn}
      className="input flex items-center justify-center gap-3 text-secondary--gray duration-300 hover:text-primary--blue"
    >
      <FontAwesomeIcon icon={faGoogle} />
      <p className="paragraph text-secondary--gray">Google</p>
    </button>
  );
};

export default SignInWithGoogle;
