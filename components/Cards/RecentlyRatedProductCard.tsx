import { doc, DocumentData, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../../firebaseApp";

interface RecentlyRatedProductCardProps {
  orgId: string;
  productId: string;
  comment: string;
  rate: number;
  ratedAt: string;
}

export default function RecentlyRatedProductCard({
  orgId,
  productId,
  comment,
  rate,
  ratedAt,
}: RecentlyRatedProductCardProps) {
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [productImageURL, setProductImageURL] = useState("");

  useEffect(() => {
    async function getProductInfo() {
      const orgDoc = doc(db, "organizations", orgId);

      const orgSnapshot = await getDoc(orgDoc);

      const orgData = orgSnapshot.data() as DocumentData;

      const product = orgData.products.find(
        (product: any) => product.id === productId
      );

      setOrgName(orgData.name);
      setOrgSlug(orgData.name.toLowerCase().replace(/\s/g, ""));
      setProductTitle(product.title);
      setProductImageURL(product.imageURL);
    }

    getProductInfo();
  }, []);

  return (
    <>
      {orgSlug && (
        <Link href={`/products/${orgSlug}/${productId}`} className="w-full">
          <div className="w-full flex flex-col justify-center items-center border border-secondary--orange duration-300 hover:border-primary--orange rounded-2xl">
            <div className="w-full p-4 flex flex-col justify-center items-center gap-y-4 border-b border-b-secondary--orange rounded-t-2xl">
              <div className="h-24">
                <Image
                  src={
                    productImageURL
                      ? productImageURL
                      : "https://via.placeholder.com/96"
                  }
                  width={96}
                  height={96}
                  alt="Product Image"
                  className="w-full h-full"
                  priority={true}
                />
              </div>
              <div className="w-5/6 flex flex-col justify-center items-center+">
                <p className="paragraph text-primary--blue text-center">
                  {productTitle}
                </p>
                <p className="small-paragraph text-secondary--orange text-center">{`by ${orgName}`}</p>
              </div>
              <p className="small-paragraph text-center">{ratedAt}</p>
            </div>

            <div className="w-full h-full p-4 flex flex-col justify-center items-center gap-y-4">
              <p className="paragraph text-secondary--gray text-center">
                <span className="heading font-medium">{rate}</span>/10
              </p>
              <em className="w-5/6 h-auto small-paragraph text-secondary--gray  text-center italic">
                {comment}
              </em>
            </div>
          </div>
        </Link>
      )}
    </>
  );
}
