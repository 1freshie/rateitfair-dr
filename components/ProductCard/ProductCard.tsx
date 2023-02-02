import Link from "next/link";

interface ProductCardProps {
  org: string;
  id: string;
  title: string;
  description: string;
  imageURL: string;
  // isRatedAlready: boolean;
}

export default function ProductCard({
  org,
  id,
  title,
  description,
  imageURL,
}: // isRatedAlready,
ProductCardProps) {
  // TODO: Decide the width and height based on the title length

  return (
    // <div
    //   className={`mt-10 flex flex-col items-center justify-around w-60 h-72 md:w-64 md:h-80 lg:w-72 lg:h-96 cursor-pointer border-2 rounded-3xl duration-300 ${
    //     isRatedAlready
    //       ? 'border-secondary--gray hover:border-primary--blue'
    //       : 'border-secondary--orange hover:border-primary--orange'
    //   }`}
    // >
    //   <img src={image} width={110} height={110} alt="AMD Ryzen 5" />
    //   <h1 className="text-lg md:text-xl lg:text-2xl text-primary--blue font-medium text-center">
    //     {title}
    //   </h1>
    //   <p
    //     className={`paragraph ${
    //       isRatedAlready ? 'text-secondary--gray' : 'text-secondary--orange'
    //     } text-center`}
    //   >
    //     {description}
    //   </p>
    //   <button
    //     className={`duration-300 ${
    //       isRatedAlready
    //         ? 'button-blue'
    //         : 'button-orange'
    //     }`}
    //   >
    //     {isRatedAlready ? 'Change' : 'Rate it'}
    //   </button>
    // </div>
    <Link href={`/products/${org}/${id}`}>
      <div
        className={`mt-10 flex flex-col items-center justify-around w-60 h-72 md:w-64 md:h-80 lg:w-72 lg:h-96 p-2 cursor-pointer border-2 rounded-3xl duration-300 border-secondary--orange hover:border-primary--orange`}
      >
        <img src={imageURL} width={110} height={110} alt={title} />
        <h1 className="text-lg md:text-xl lg:text-2xl text-primary--blue font-medium text-center">
          {title}
        </h1>
        <p className={`paragraph text-secondary--orange text-center`}>
          {description}
        </p>
        <button className={`duration-300 button-orange`}>Rate It</button>
      </div>
    </Link>
  );
}
