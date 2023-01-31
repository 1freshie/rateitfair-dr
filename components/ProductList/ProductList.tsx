import ProductCard from '../ProductCard/ProductCard';

interface ProductListProps {
  org: string;
  products: {
    id: string;
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

export default function ProductList({ org, products }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center items-center">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          org={org}
          id={product.id}
          title={product.title}
          description={product.description}
          imageURL={product.imageURL}
          // isRatedAlready={product.isRatedAlready}
        />
      ))}
    </div>
  );
}
