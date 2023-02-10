import { StarIcon } from "@heroicons/react/24/solid";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthState from "../../../../components/AuthState/AuthState";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import ProductInfo from "../../../../components/ProductInfo/ProductInfo";

import { auth, db } from "../../../../firebase/firebaseApp";

interface Data {
  productData: DocumentData;
  orgId: string;
}

interface Params extends ParsedUrlQuery {
  orgName: string;
  productId: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
};

export default function ProductPage({ productData, orgId }: Data) {
  const [user, loading, error] = useAuthState(auth);

  const router = useRouter();
  const { orgName, productId } = router.query;

  // const [product, setProduct] = useState(productData);

  const [userRole, setUserRole] = useState("User");

  const [rateValue, setRateValue] = useState<number | null>(null);
  const [enteredComment, setEnteredComment] = useState("");

  const [inEditMode, setInEditMode] = useState(true);

  const [usersCommentsCount, setUsersCommentsCount] = useState<number>(
    productData.usersRated.filter(
      (userRated: any) => userRated.userComment.length > 0
    ).length
  );

  useEffect(() => {
    async function checkIfUserRated() {
      if (user) {
        const userDoc = doc(db, "users", user!.uid);

        const userSnapshot = await getDoc(userDoc);

        const userData = userSnapshot.data() as DocumentData;

        setUserRole(userData.role);

        if (userData.ratedProducts) {
          const userRatedProducts = userData.ratedProducts;

          const userRatedProduct = userRatedProducts.filter(
            (ratedProduct: any) => ratedProduct.productId === productData.id
          )[0];

          if (userRatedProduct) {
            setRateValue(userRatedProduct.rate);
            setEnteredComment(userRatedProduct.comment);
            setInEditMode(userRatedProduct.editMode);
          } else {
            setRateValue(null);
            setEnteredComment("");
            setInEditMode(true);
          }
        }
      }
    }

    checkIfUserRated();
  }, [inEditMode, user]);

  if (loading || error) {
    return <AuthState />;
  }

  async function handleRateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (rateValue === null) {
      prompt("Error", "Please select a rate from 0 to 10!");
      return;
    }

    const newRates = productData.rates;
    newRates[rateValue] += 1;

    const newRatesCount = productData.ratesCount + 1;

    let newUsersRated: any[];

    if (productData.usersRated) {
      newUsersRated = productData.usersRated;
    } else {
      newUsersRated = [];
    }

    const userRatedAt = Timestamp.fromDate(new Date());

    newUsersRated.push({
      userId: user!.uid,
      userEmail: user!.email,
      userRate: rateValue,
      userComment: enteredComment,
      userRatedAt: userRatedAt,
    });

    const updatedProduct = {
      ...productData,
      rates: newRates,
      ratesCount: newRatesCount,
      usersRated: newUsersRated,
    };

    const orgDoc = doc(db, "organizations", orgId);

    const orgSnapshot = await getDoc(orgDoc);

    const orgData = orgSnapshot.data() as DocumentData;

    const newOrgData = {
      ...orgData,
      products: orgData.products.map((product: any) => {
        if (product.id === productData.id) {
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
              orgId: orgData.id,
              productId: productData.id,
              comment: enteredComment,
              rate: rateValue,
              editMode: false,
              ratedAt: userRatedAt,
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
        orgId: orgData.id,
        productId: productData.id,
        comment: enteredComment,
        rate: rateValue,
        editMode: false,
        ratedAt: userRatedAt,
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

    // TOOD: Check if the user already rated the product!

    setRateValue(null);
    setEnteredComment("");
    setInEditMode(false);
  }

  const chartLabels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "# of rates",
        data: productData.rates,
        // backgroundColor: "rgba(255, 99, 132, 0.2)",
        // borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(249, 171, 85, 0.2)",
        borderColor: "rgba(245, 138, 7, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{`RateItFair - ${productData.title}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={`Rate now ${productData.title}!`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {user && (
        <div className="w-full h-full mt-16 flex flex-1 flex-col lg:flex-row gap-y-11 lg:gap-x-11 justify-between items-center text-center">
          <ProductInfo
            title={productData.title}
            description={productData.description}
            imageURL={productData.imageURL}
          />

          {userRole !== "Admin" && userRole !== "User" ? (
            <div className="w-full lg:w-1/2 h-full p-6 border border-primary--blue rounded-2xl">
              <h1 className="heading">Ratings</h1>
              <div className="w-full h-full my-8">
                <Bar options={chartOptions} data={chartData} />
              </div>
              <div className="w-full h-full flex flex-col items-center justify-center gap-y-3">
                <p className="small-paragraph text-secondary--orange">
                  There are{" "}
                  <span className="font-medium">{usersCommentsCount}</span>{" "}
                  comments on this product...
                </p>
                <Link href={`/products/${orgName}/${productId}/comments`}>
                  <button className="button-blue duration-300">View all</button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="w-full lg:w-1/2 h-full p-6 border border-primary--blue rounded-2xl">
              {inEditMode ? (
                <>
                  <div className="w-full h-full flex flex-col gap-y-2">
                    <h1 className="heading">
                      How would you rate this product?
                    </h1>
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
                            rateValue! >= i && rateValue !== null
                              ? "#f9ab55"
                              : "none"
                          }
                          stroke="#f9ab55"
                        />
                        <p
                          className={`paragraph duration-300 ${
                            rateValue! >= i &&
                            rateValue !== null &&
                            "text-primary--blue"
                          }`}
                        >
                          {i}
                        </p>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={handleRateSubmit}
                    className="w-full h-full flex flex-col justify-center items-center gap-y-2"
                  >
                    <p className="small-paragraph text-primary--blue text-center">
                      Want to share an opinion about the product?
                    </p>
                    <textarea
                      placeholder="Is something wrong with this product? Tell us about any improvements that should be made..."
                      className="input resize-none h-36 md:h-40 lg:h-44 xl:h-48"
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setEnteredComment(e.target.value)
                      }
                    />
                    <button
                      type="submit"
                      className="mt-5 button-blue duration-300"
                    >
                      Rate it
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="w-full h-full flex flex-col gap-y-2">
                    <h1 className="heading">Thank you!</h1>
                    <p className="paragraph">
                      You rated this product{" "}
                      <span className="text-primary--orange font-medium">
                        {rateValue}
                      </span>
                      /10!
                    </p>
                  </div>
                  {enteredComment.length > 0 && (
                    <div className="w-full h-full my-10 flex flex-col gap-y-2">
                      <p className="paragraph text-primary--blue">
                        You also commented on it:
                      </p>
                      <p className="small-paragraph text-center italic">
                        {enteredComment}
                      </p>
                    </div>
                  )}

                  <div className="w-full h-full flex flex-col items-center justify-center gap-y-3">
                    <p className="small-paragraph text-secondary--orange">
                      Changed your opinion?
                    </p>
                    <button
                      className="button-blue duration-300"
                      onClick={() => setInEditMode(true)}
                    >
                      Change it
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export async function getStaticPaths() {
  const orgsSnapshot = await getDocs(collection(db, "organizations"));

  const orgsData = orgsSnapshot.docs.map((org) => org.data());

  const paths = orgsData.map((org) => {
    const orgName = org.name.toLowerCase().replace(/\s/g, "");

    return org.products.map((product: any) => ({
      params: { orgName, productId: product.id },
    }));
  });

  return {
    paths: paths.flat(),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<Data, Params> = async (context) => {
  const { params } = context;
  const { orgName, productId } = params as Params;

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

  if (!neededProduct.usersRated) {
    neededProduct.usersRated = [];
  }

  return {
    props: {
      productData: {
        ...neededProduct,
        usersRated: neededProduct.usersRated.map((user: any) => {
          return {
            ...user,
            userRatedAt: user.userRatedAt.toDate().toString(),
          };
        }),
      },
      orgId,
    },
  };
};
