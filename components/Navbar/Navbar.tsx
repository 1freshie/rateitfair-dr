// 'use client';

import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { db } from "../../firebaseApp";

import NavState from "./NavState";

export default function Navbar({ userId }: { userId: string }) {
  return (
    <nav className="sticky top-0 w-full h-20 max-h-20 bg-background--white flex flex-col gap-y-4 md:gap-y-0 md:flex-row justify-between items-center tracking-wide">
      <Link
        href="/"
        className="font-extrabold text-3xl lg:text-5xl text-primary--orange select-none duration-300 hover:text-secondary--orange"
      >
        RateItFair
      </Link>
      <ul className="flex justify-between items-center gap-x-11 font-semibold text-lg md:text-xl lg:text-2xl text-secondary--orange">
        <li className="duration-300 hover:text-primary--orange">
          <Link href="/">Home</Link>
        </li>
        <NavState />
      </ul>
    </nav>
  );
}
