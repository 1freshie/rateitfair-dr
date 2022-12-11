'use client';

import { useEffect, useState } from 'react';

import Star from './Star';

type StarRowProps = {
  starCount: number;
  width: number;
  height: number;
};

const StarRow: React.FC<StarRowProps> = ({ starCount, width, height }) => {
  const [starRow, setStarRow] = useState<JSX.Element[]>([]);

  useEffect(() => {
    let currentStarRow: JSX.Element[] = [];
    for (let i = 0; i < starCount; i++) {
      currentStarRow.push(<Star width={width} height={height} key={i} />);
    }
    setStarRow(currentStarRow);
  }, [starCount]);

  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     let starRow: JSX.Element[] = [];
  //     for (let i = 0; i < starCount; i++) {
  //       starRow.push(
  //         <Star width={width} height={height} key={i} fill={true} />
  //       );
  //     }
  //     setStarRow(starRow);
  //   }, 500);
  //   return () => clearInterval(interval);
  // }, [starCount]);

  return <>{starRow}</>;
};

export default StarRow;
