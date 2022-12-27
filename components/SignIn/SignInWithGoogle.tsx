'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

import { signInWithGoogle } from '../../context/auth-context';

const SignInWithGoogle: React.FC = () => {
  return (
    <button
      onClick={signInWithGoogle}
      className="input flex items-center justify-center gap-3 text-secondary--gray duration-300 hover:text-primary--blue"
    >
      <FontAwesomeIcon icon={faGoogle} />
      <p className="paragraph text-secondary--gray">Google</p>
    </button>
  );
};

export default SignInWithGoogle;
