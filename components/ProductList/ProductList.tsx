import { useState } from "react";
import ProductCard from "../cards/ProductCard";

interface ProductListProps {
  orgId: string;
  orgSlug: string;
  isAdminOrOrg: boolean;
  products: {
    id: string;
    title: string;
    description?: string;
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
    ratesCount: number;
    imageURL: string;
  }[];
}

export default function ProductList({
  orgId,
  orgSlug,
  isAdminOrOrg,
  products,
}: ProductListProps) {
  const [productList, setProductList] = useState(products);

  function deleteProduct(id: string) {
    const newProductList = productList.filter((product) => product.id !== id);

    setProductList(newProductList);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center items-center">
      {productList.map((product, index) => (
        <ProductCard
          key={index}
          orgId={orgId}
          orgSlug={orgSlug}
          id={product.id}
          title={product.title}
          rates={product.rates}
          // description={product.description}
          ratesCount={product.ratesCount}
          imageURL={product.imageURL}
          isAdminOrOrg={isAdminOrOrg}
          deleteProduct={deleteProduct}
        />
      ))}
    </div>
  );
}
