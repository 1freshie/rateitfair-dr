// 'use client';

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="w-full max-h-20 flex flex-col gap-y-4 md:gap-y-0 md:flex-row justify-between items-center tracking-wide">
      <Link href="/" className="font-extrabold text-3xl text-primary--orange">
        RateItFair
      </Link>
      <ul className="flex justify-between items-center gap-x-11 font-semibold text-lg md:text-xl lg:text-2xl text-secondary--orange">
        <li className="hover:text-primary--orange">
          <Link href="/">Home</Link>
        </li>
        <li className="hover:text-primary--orange">
          <Link href="/login">Login</Link>
        </li>
        <li className="hover:text-primary--orange">
          <Link href="/signup">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
