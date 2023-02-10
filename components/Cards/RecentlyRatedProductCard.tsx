import { doc, DocumentData, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseApp";

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
    <Link href={`/products/${orgSlug}/${productId}`}>
      <div className="w-full flex flex-col justify-center items-center border border-secondary--orange duration-300 hover:border-primary--orange rounded-2xl">
        <div className="w-full p-4 flex flex-col justify-center items-center gap-y-4 border-b border-b-secondary--orange rounded-t-2xl">
          <div className="h-16">
            <Image
              src={productImageURL}
              width={64}
              height={64}
              alt="Product Image"
              className="w-full h-full"
              priority={true}
            />
          </div>
          <p className="paragraph text-primary--blue text-center">
            {productTitle}
          </p>
          <p className="small-paragraph text-secondary--orange text-center">{`by ${orgName}`}</p>
          <p className="small-paragraph text-center">{ratedAt}</p>
        </div>

        <div className="w-full h-full p-4 flex flex-col justify-center items-center gap-y-4">
          <p className="heading text-center">{`${rate}/10`}</p>
          <p className="paragraph w-full h-auto text-center italic">
            {comment}
          </p>
        </div>
      </div>
    </Link>
  );
}
