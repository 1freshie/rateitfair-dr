import ProductCard from '../ProductCard/ProductCard';

interface ProductListProps {
  products: {
    title: string;
    description: string;
    imageURL: string;
    // isRatedAlready: boolean;
  }[];
};

// const ProductList: React.FC<ProductListProps> = ({ products }) => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center items-center">
//       {products.map((product, index) => (
//         <ProductCard
//           key={index}
//           title={product.title}
//           description={product.description}
//           image={product.image}
//           // isRatedAlready={product.isRatedAlready}
//         />
//       ))}
//     </div>
//   );
// };

// export default ProductList;

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center items-center">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          title={product.title}
          description={product.description}
          imageURL={product.imageURL}
          // isRatedAlready={product.isRatedAlready}
        />
      ))}
    </div>
  );
}
