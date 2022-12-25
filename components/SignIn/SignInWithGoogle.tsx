'use client';

import { signInWithGoogle } from '../../context/auth-context';

const SignInWithGoogle: React.FC = () => {
  return (
    <button
      onClick={signInWithGoogle}
      className="input flex items-center justify-between"
    >
      <p className="paragraph text-secondary--gray">Google</p>
    </button>
  );
};

export default SignInWithGoogle;
