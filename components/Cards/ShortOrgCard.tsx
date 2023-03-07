import { StarIcon } from "@heroicons/react/20/solid";
import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

interface ShortOrgCardProps {
  orgSlug: string;
  // product: {
  //   id: string;
  //   title: string;
  //   imageURL: string;
  // };
  productId: string;
  productTitle: string;
  productImageURL: string;
  averageRate: number;
}

export default function ShortOrgCard({
  orgSlug,
  productId,
  productTitle,
  productImageURL,
  averageRate,
}: ShortOrgCardProps) {
  return (
    <Link
      href={`/products/${orgSlug}/${productId}`}
      className="w-full h-full flex flex-col justify-center items-center gap-y-2 p-6 border border-secondary--gray hover:border-primary--blue duration-300 rounded-2xl"
    >
      <div className="w-24 h-24 lg:w-32 lg:h-32">
        <Image
          src={productImageURL}
          alt="Product image"
          width={128}
          height={128}
          className="w-full h-full"
          priority={true}
        />
      </div>
      <h1 className="small-paragraph text-primary--blue text-center">
        {productTitle}
      </h1>
      <div className="flex justify-center items-center text-center gap-x-1">
        <p className="small-paragraph text-secondary--orange">
          <strong>{averageRate}</strong>/10
        </p>
        <StarIcon
          fill="none"
          stroke="#f9ab55"
          className="w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 text-primary--orange"
        />
      </div>
    </Link>
  );
}
