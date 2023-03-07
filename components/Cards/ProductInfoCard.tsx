import { StarIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ProductInfoCardProps {
  title: string;
  description: string;
  imageURL: string;
  ratesCount: number;
  rates: {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
  };
}

export default function ProductInfoCard({
  title,
  description,
  imageURL,
  ratesCount,
  rates,
}: ProductInfoCardProps) {
  const [averageRate, setAverageRate] = useState(0);

  useEffect(() => {
    let sum = 0;
    let count = 0;

    for (const [key, value] of Object.entries(rates)) {
      if (value > 0) {
        sum += Number(key) * value;
        count += value;
      }
    }

    let average = count > 0 ? sum / count : 0;

    setAverageRate(Math.round(average * 10) / 10);
  }, []);

  return (
    <article className="w-full h-full flex flex-1 flex-col gap-y-4 lg:gap-y-5 justify-center items-center">
      <div className="w-48 h-48 lg:w-64 lg:h-64">
        <Image
          src={imageURL}
          width={256}
          height={256}
          alt={title}
          className="w-full h-full"
          priority={true}
        />
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center gap-y-4">
        <h1 className="heading">{title}</h1>
        <p className="small-paragraph lg:w-4/5">{description}</p>
      </div>
      <div className="flex flex-col justify-center items-center gap-y-1 mt-8">
        <p className="paragraph">This product has an average of</p>
        <div className="flex justify-center items-center text-center gap-x-1">
          <p className="paragraph">
            <strong>{averageRate}</strong>/10
          </p>
          <StarIcon
            fill="none"
            stroke="#f9ab55"
            className="w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 text-primary--orange"
          />
        </div>
        <p className="paragraph text-secondary--gray">
          (<strong>{ratesCount}</strong> users rated it!)
        </p>
      </div>
    </article>
  );
}
