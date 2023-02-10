import Image from "next/image";

interface ProductProps {
  title: string;
  description: string;
  imageURL: string;
}

export default function ProductInfo({
  title,
  description,
  imageURL,
}: ProductProps) {
  return (
    <div className="w-full h-full flex flex-1 flex-col gap-y-4 lg:gap-y-10 justify-center items-center">
      <Image
        src={imageURL}
        width={256}
        height={256}
        alt={title}
        className="w-auto h-auto"
        priority={true}
      />
      <div className="w-full h-full flex flex-col justify-center items-center gap-y-4">
        <h1 className="heading">{title}</h1>
        <p className="small-paragraph lg:w-4/5">{description}</p>
      </div>
    </div>
  );
}
