'use client';

type ProductCardProps = {
  title: string;
  description: string;
  image: string;
  isRatedAlready: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  image,
  isRatedAlready,
}) => {
  // TODO: Decide the width and height based on the title length

  return (
    <div
      className={`mt-10 flex flex-col items-center justify-around w-60 h-72 md:w-64 md:h-80 lg:w-72 lg:h-96 cursor-pointer border-2 rounded-3xl ${
        isRatedAlready
          ? 'border-secondary--gray hover:border-primary--blue'
          : 'border-secondary--orange hover:border-primary--orange'
      }`}
    >
      <img src={image} width={110} height={110} alt="AMD Ryzen 5" />
      <h1 className="text-lg md:text-xl lg:text-2xl text-primary--blue font-medium text-center">
        {title}
      </h1>
      <p
        className={`paragraph ${
          isRatedAlready ? 'text-secondary--gray' : 'text-secondary--orange'
        } text-center`}
      >
        {description}
      </p>
      <button
        className={`button ${
          isRatedAlready
            ? 'bg-primary--blue hover:bg-secondary--gray'
            : 'bg-primary--orange'
        }`}
      >
        {isRatedAlready ? 'Change it' : 'Rate it'}
      </button>
    </div>
  );
};

export default ProductCard;
