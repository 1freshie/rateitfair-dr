import ProductCard from '../ProductCard/ProductCard';

interface ProductListProps {
  org: string;
  products: {
    id: string;
    title: string;
    description?: string;
    ratesCount: number;
    imageURL: string;
  }[];
};

export default function ProductList({ org, products }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center items-center">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          org={org}
          id={product.id}
          title={product.title}
          // description={product.description}
          ratesCount={product.ratesCount}
          imageURL={product.imageURL}
        />
      ))}
    </div>
  );
}
