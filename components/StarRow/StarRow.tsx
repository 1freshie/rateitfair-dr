'use client';

import { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

type StarRowProps = {
  stars: number;
  width: number;
  height: number;
};

const StarRow: React.FC<StarRowProps> = ({ stars, width, height }) => {
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
          width={width}
          height={height}
          fill={value ? '#f9ab55' : 'none'}
          stroke="#f9ab55"
          key={index}
        />
      ))}
    </>
  );
};

export default StarRow;
