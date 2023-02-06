import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  org: string;
  id: string;
  title: string;
  ratesCount: number;
  imageURL: string;
}

export default function ProductCard({
  org,
  id,
  title,
  ratesCount,
  imageURL,
}: ProductCardProps) {
  return (
    <Link href={`/products/${org}/${id}`}>
      <div className="mt-10 flex flex-col items-center justify-around w-60 h-72 md:w-64 md:h-80 lg:w-72 lg:h-96 p-2 cursor-pointer border-2 rounded-3xl duration-300 border-secondary--orange hover:border-primary--orange">
        <Image
          src={imageURL}
          width={128}
          height={128}
          alt={title}
          className="w-auto h-auto"
        />
        <h1 className="text-lg md:text-xl lg:text-2xl text-primary--blue font-medium text-center">
          {title}
        </h1>
        <p className="paragraph text-secondary--gray text-center">
          <span className="font-medium">{ratesCount}</span> users rated this
          product...
        </p>
        <button className="duration-300 button-orange">Rate It</button>
      </div>
    </Link>
  );
}
