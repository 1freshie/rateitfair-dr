'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

interface StarRowProps {
  stars: number;
};

export default function StarRow({ stars }: StarRowProps) {
  const [toFill, setToFill] = useState<boolean[]>([]);

  useEffect(() => {
    let currentToFill: boolean[] = [];
    for (let i = 0; i < stars; i++) {
      currentToFill.push(false);
    }
    setToFill(currentToFill);
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      let currentToFill = [...toFill];
      let index = currentToFill.indexOf(false);
      if (index !== -1) {
        currentToFill[index] = true;
        setToFill(currentToFill);
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    let interval = setInterval(() => {
      let currentToFill = [...toFill];
      for (let i = 0; i < stars; i++) {
        currentToFill[i] = false;
      }
      setToFill(currentToFill);
    }, 3000);
    return () => clearInterval(interval);
  });

  return (
    <>
      {toFill.map((value: boolean, index: number) => (
        <StarIcon
          fill={value ? '#f9ab55' : 'none'}
          stroke="#f9ab55"
          key={index}
          className="w-24 md:w-28 lg:w-32 xl:w-36 h-24 md:h-28 lg:h-32 xl:h-36"
        />
      ))}
    </>
  );
};