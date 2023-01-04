'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

import { signInWithFacebook } from '../../context/auth-context';

const SignInWithFacebook: React.FC = () => {
  const router = useRouter();

  const handleSignIn = async () => {
    await signInWithFacebook();
    router.push('/');
  };

  return (
    <button
      onClick={handleSignIn}
      className="input flex items-center justify-center gap-3 text-secondary--gray duration-300 hover:text-primary--blue"
    >
      <FontAwesomeIcon icon={faFacebook} />
      <p className="paragraph text-secondary--gray">
        Facebook
      </p>
    </button>
  );
};

export default SignInWithFacebook;
