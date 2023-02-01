import { StarIcon } from "@heroicons/react/24/solid";
import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthState from "../../../../components/AuthState/AuthState";

import { auth, db } from "../../../../firebase/firebaseApp";

interface Data {
  productData: DocumentData;
}

interface Params extends ParsedUrlQuery {
  orgName: string;
  productId: string;
}

export default function ProductPage() {
  // TODO: make the comments property in the User document! (see if it works)

  const [user, loading, error] = useAuthState(auth);

  const [product, setProduct] = useState<{
    title: string;
    description: string;
    imageURL: string;
    ratesCount: number;
    rates: {
      [key: number]: number;
    };
  }>({
    title: "",
    description: "",
    imageURL: "",
    ratesCount: 0,
    rates: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
    },
  });

  const [rateValue, setRateValue] = useState<number | null>(null);
  const [enteredComment, setEnteredComment] = useState<string>("");

  const router = useRouter();

  const { orgName, productId } = router.query;

  useEffect(() => {
    async function getProduct() {
      const orgsSnapshot = await getDocs(collection(db, "organizations"));

      const orgsData = orgsSnapshot.docs.map((org) => org.data());

      const orgId = orgsData.filter(
        (orgData) => orgData.name.toLowerCase().replace(/\s/g, "") === orgName
      )[0].id;

      const orgDoc = doc(db, "organizations", orgId);

      const orgSnapshot = await getDoc(orgDoc);

      const orgData = orgSnapshot.data() as DocumentData;

      const neededProduct = orgData.products.filter(
        (product: any) => product.id === productId
      )[0];

      setProduct(neededProduct);
    }

    getProduct();
  }, []);

  // console.log(product.rates);
  // console.log(rateValue);

  async function handleRateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (rateValue === null) {
      prompt("Error", "Please select a rate from 0 to 10!");
      return;
    }

    const newRates = product.rates;
    newRates[rateValue] += 1;

    const newRatesCount = product.ratesCount + 1;

    const updatedProduct = {
      ...product,
      rates: newRates,
      ratesCount: newRatesCount,
    };

    // setProduct(newProduct);
    // console.log(updatedProduct);

    const orgsSnapshot = await getDocs(collection(db, "organizations"));

    const orgsData = orgsSnapshot.docs.map((org) => org.data());

    const orgId = orgsData.filter(
      (orgData) => orgData.name.toLowerCase().replace(/\s/g, "") === orgName
    )[0].id;

    const orgDoc = doc(db, "organizations", orgId);

    const orgSnapshot = await getDoc(orgDoc);

    const orgData = orgSnapshot.data() as DocumentData;

    // const newProducts = orgData.products.filter(
    //   (product: any) => product.id !== productId
    // );

    // newProducts.push(updatedProduct);

    // const newOrgData = {
    //   ...orgData,
    //   products: newProducts,
    // };

    const newOrgData = {
      ...orgData,
      products: orgData.products.map((product: any) => {
        if (product.id === productId) {
          return updatedProduct;
        } else {
          return product;
        }
      }),
    };

    try {
      await updateDoc(orgDoc, newOrgData);
    } catch (err: any) {
      prompt("Error", err.message);
    }

    const userDoc = doc(db, "users", user!.uid);

    const userSnapshot = await getDoc(userDoc);

    const userData = userSnapshot.data() as DocumentData;

    const userRatedProductsCount = userData.ratedProductsCount;

    if (!userData.ratedProducts) {
      try {
        await updateDoc(userDoc, {
          ...userData,
          ratedProducts: [
            {
              orgId: orgId,
              productId: productId,
              comment: enteredComment,
              rate: rateValue,
              ratedAt: new Date(),
            },
          ],
          ratedProductsCount: userRatedProductsCount + 1,
        });
      } catch (err: any) {
        prompt("Error", err.message);
      }
    } else {
      const newRatedProducts = userData.ratedProducts;

      newRatedProducts.push({
        orgId: orgId,
        productId: productId,
        comment: enteredComment,
        rate: rateValue,
        ratedAt: new Date(),
      });

      const newUserData = {
        ...userData,
        ratedProducts: newRatedProducts,
        ratedProductsCount: userRatedProductsCount + 1,
      };

      try {
        await updateDoc(userDoc, newUserData);
      } catch (err: any) {
        prompt("Error", err.message);
      }
    }

    // TOOD: Change the rate div to successfull rate div and check if the user already rated the product!

    // router.push(`/products/${orgName}/${productId}/success`);

    setRateValue(null);
    setEnteredComment("");
  }

  if (loading || error) {
    return <AuthState />;
  }

  return (
    <>
      <Head>
        <title>{`RateItFair - ${product.title}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={`Rate now ${product.title}!`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full h-full flex flex-1 flex-col lg:flex-row gap-y-11 lg:gap-x-11 justify-between items-center text-center">
        <div className="w-full h-full flex flex-1 flex-col gap-y-4 lg:gap-y-8 justify-center items-center">
          <img
            src={product.imageURL}
            alt={product.title}
            className="w-1/3 h-1/3"
          />
          <div className="w-full h-full flex flex-col justify-center items-center gap-y-4">
            <h1 className="heading">{product.title}</h1>
            <p className="paragraph text-secondary--gray lg:w-4/5">
              {product.description}
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 h-full p-6 border border-primary--blue rounded-[30px]">
          <div className="w-full h-full flex flex-col gap-y-2">
            <h1 className="heading">How would you rate this product?</h1>
            <p className="paragraph">Choose from 0 to 10...</p>
          </div>

          <div className="w-full h-full my-8 grid grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2">
            {[...Array(11)].map((_, i) => (
              <div
                key={i}
                className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
                onClick={() => setRateValue(i)}
              >
                <StarIcon
                  className="w-14 md:w-20 xl:w-24 h-14 md:h-20 xl:h-24 duration-300"
                  fill={
                    rateValue! >= i && rateValue != null ? "#f9ab55" : "none"
                  }
                  stroke="#f9ab55"
                />
                <p
                  className={`paragraph duration-300 ${
                    rateValue! >= i && rateValue != null && "text-primary--blue"
                  }`}
                >
                  {i}
                </p>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleRateSubmit}
            className="w-full h-full flex flex-col justify-center items-center gap-y-4"
          >
            <p className="paragraph text-primary--blue text-center">
              Want the product to be improved?
            </p>
            <textarea
              placeholder="Is something wrong with the product? Tell us about any improvements that should be made..."
              className="input resize-none h-36 md:h-40 lg:h-44 xl:h-48"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setEnteredComment(e.target.value)
              }
            />
            <button type="submit" className="mt-5 button-orange duration-300">
              Rate it
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

// export async function getStaticPaths() {
//   const orgsDocs = await getDocs(collection(db, "organizations"));

//   const orgsData = orgsDocs.docs.map((org) => org.data());

//   const orgsNames = orgsData.map((orgData) =>
//     orgData.name.toLowerCase().replace(/\s/g, "")
//   );

//   const paths = orgsNames.map((orgName) => ({
//     params: { orgName },
//   }));

//   return { paths, fallback: false };
// }

// export const getStaticProps: GetStaticProps<Data, Params> = async (context) => {
//   const { params } = context;
//   const { orgName } = params as Params;
//   const { productId } = params as Params;

//   const orgsSnapshot = await getDocs(collection(db, "organizations"));

//   const orgsData = orgsSnapshot.docs.map((org) => org.data());

//   const orgId = orgsData.filter(
//     (orgData) => orgData.name.toLowerCase().replace(/\s/g, "") === orgName
//   )[0].id;

//   const orgDoc = doc(db, "organizations", orgId);

//   const orgSnapshot = await getDoc(orgDoc);

//   const orgData = orgSnapshot.data() as DocumentData;

//   console.log(orgData.products);

//   return {
//     props: {
//       productData: orgData,
//     },
//     revalidate: 1,
//   };
// };
