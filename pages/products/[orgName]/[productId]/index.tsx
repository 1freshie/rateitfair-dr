import { Dialog, Transition } from "@headlessui/react";
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
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useAuthState } from "react-firebase-hooks/auth";

import TextArea from "../../../../components/inputs/TextArea";
import ProductInfo from "../../../../components/ProductInfo/ProductInfo";
import ErrorState from "../../../../components/states/ErrorState";
import LoadingState from "../../../../components/states/LoadingState";
import { auth, db } from "../../../../firebaseApp";

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

  const [isVerifiedUser, setIsVerifiedUser] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const [product, setProduct] = useState(productData);

  const [userRole, setUserRole] = useState("");

  const [rateValue, setRateValue] = useState<number | null>(null);
  const [enteredComment, setEnteredComment] = useState("");

  const [showBar, setShowBar] = useState(false);
  const [confirmEditing, setConfirmEditing] = useState(false);
  const [inEditMode, setInEditMode] = useState(true);

  const [usersCommentsCount, setUsersCommentsCount] = useState<number>(
    productData.usersRated.filter(
      (userRated: any) => userRated.userComment.length > 0
    ).length
  );

  const cancelButtonRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);

    if (user) {
      if (
        user.emailVerified ||
        user.providerId === "google.com" ||
        user.providerId === "facebook.com"
      ) {
        setIsVerifiedUser(true);
      }
    }

    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    setIsLoading(true);

    async function checkIfUserRated() {
      if (user) {
        const userDoc = doc(db, "users", user.uid);

        const userSnapshot = await getDoc(userDoc);

        const userData = userSnapshot.data() as DocumentData;

        setUserRole(userData.role);

        if (userData.ratedProducts) {
          const userRatedProducts = userData.ratedProducts;

          const userRatedProduct = userRatedProducts.find(
            (ratedProduct: any) => ratedProduct.productId === productData.id
          );

          if (userRatedProduct) {
            setRateValue(userRatedProduct.rate);
            setEnteredComment(userRatedProduct.comment);
            setInEditMode(false);
            // setInEditMode(userRatedProduct.editMode);
          } else {
            setRateValue(null);
            setEnteredComment("");
            setInEditMode(true);
            // setInEditMode(true);
          }
        }
      }
    }

    checkIfUserRated();

    setIsLoading(false);
  }, [user, inEditMode]);

  useEffect(() => {
    for (const key in productData.rates) {
      if (productData.rates[key] !== 0) {
        setShowBar(true);
      }
    }
  }, []);

  if (loading || isLoading || !userRole) {
    return <LoadingState />;
  }

  if (!isVerifiedUser) {
    return (
      <div className="w-full h-full self-center flex flex-col justify-center items-center text-center">
        <p>Email not verified!</p>
        <p>
          Please verify your email <strong>{user?.email}</strong> to continue.
        </p>
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error.message} />;
  }

  if (!user) {
    router.push("/login");
  }

  async function handleRateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (rateValue === null) {
      // prompt("Error", "Please select a rate from 0 to 10!");
      setErrorMessage("Please select a rate from 0 to 10!");
      return;
    }

    setIsLoading(true);

    let newRates = productData.rates;
    newRates[rateValue] += 1;

    let newRatesCount = productData.ratesCount;

    let newUsersRated: any[];

    if (productData.usersRated) {
      newUsersRated = productData.usersRated;
      console.log(newUsersRated);
    } else {
      newUsersRated = [];
    }

    let userRated = newUsersRated.find(
      (userRated: any) => userRated.userId === user!.uid
    );

    const userRatedAt = Timestamp.fromDate(new Date());

    if (userRated) {
      // console.log("im here");
      newRates[userRated.userRate] -= 1;

      userRated = {
        ...userRated,
        userRate: rateValue,
        userComment: enteredComment,
        userRatedAt: userRatedAt,
      };

      // console.log(userRated);

      newUsersRated = newUsersRated.map((currUserRated: any) => {
        if (currUserRated.userId === user!.uid) {
          return userRated;
        }
        return currUserRated;
      });

      // console.log(newUsersRated);
    } else {
      newUsersRated.push({
        userId: user!.uid,
        userEmail: user!.email,
        userRate: rateValue,
        userComment: enteredComment,
        userRatedAt: userRatedAt,
      });

      newRatesCount += 1;
    }

    // console.log(newUsersRated);

    // newUsersRated.push({
    //   userId: user!.uid,
    //   userEmail: user!.email,
    //   userRate: rateValue,
    //   userComment: enteredComment,
    //   userRatedAt: userRatedAt,
    // });

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
      // prompt("Error", err.message);
      setErrorMessage(err.message);
    }

    const userDoc = doc(db, "users", user!.uid);

    const userSnapshot = await getDoc(userDoc);

    const userData = userSnapshot.data() as DocumentData;

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
              ratedAt: userRatedAt,
            },
          ],
        });
      } catch (err: any) {
        // prompt("Error", err.message);
        setErrorMessage(err.message);
      }
    } else {
      let newRatedProducts = userData.ratedProducts;

      let userRatedProduct = newRatedProducts.find(
        (ratedProduct: any) => ratedProduct.productId === productData.id
      );

      if (userRatedProduct) {
        userRatedProduct = {
          ...userRatedProduct,
          comment: enteredComment,
          rate: rateValue,
          ratedAt: userRatedAt,
        };

        newRatedProducts = newRatedProducts.map((ratedProduct: any) => {
          if (ratedProduct.productId === productData.id) {
            return userRatedProduct;
          } else {
            return ratedProduct;
          }
        });
      } else {
        newRatedProducts.push({
          orgId: orgData.id,
          productId: productData.id,
          comment: enteredComment,
          rate: rateValue,
          ratedAt: userRatedAt,
        });
      }

      // newRatedProducts.push({
      //   orgId: orgData.id,
      //   productId: productData.id,
      //   comment: enteredComment,
      //   rate: rateValue,
      //   // editMode: false,
      //   ratedAt: userRatedAt,
      // });

      const newUserData = {
        ...userData,
        ratedProducts: newRatedProducts,
      };

      try {
        await updateDoc(userDoc, newUserData);
      } catch (err: any) {
        // prompt("Error", err.message);
        setErrorMessage(err.message);
      }
    }

    setIsLoading(false);
    setErrorMessage("");
    setRateValue(null);
    setEnteredComment("");
    setConfirmEditing(false);
    setInEditMode(false);
  }

  function handleCommentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setEnteredComment(e.target.value);
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
        <div className="w-full h-full self-center flex flex-1 flex-col lg:flex-row gap-y-11 lg:gap-x-11 justify-between items-center text-center">
          <ProductInfo
            title={productData.title}
            description={productData.description}
            imageURL={productData.imageURL}
            ratesCount={productData.ratesCount}
            rates={productData.rates}
          />

          {userRole !== "Admin" && userRole !== "User" ? (
            <article className="w-full lg:w-1/2 h-full p-6 border border-primary--blue rounded-2xl">
              {errorMessage && <ErrorState error={errorMessage} />}

              <h1 className="heading">Ratings</h1>
              <div className="w-full h-full my-8">
                {showBar ? (
                  <Bar options={chartOptions} data={chartData} />
                ) : (
                  <em className="paragraph text-secondary--gray">
                    Still no rates yet...
                  </em>
                )}
              </div>
              <div className="w-full h-full flex flex-col items-center justify-center gap-y-3">
                <p className="small-paragraph text-secondary--orange">
                  There are <strong>{usersCommentsCount}</strong> comments on
                  this product...
                </p>
                {usersCommentsCount > 0 && (
                  <Link href={`/products/${orgName}/${productId}/comments`}>
                    <button className="button-blue duration-300">
                      View all
                    </button>
                  </Link>
                )}
              </div>
            </article>
          ) : (
            <article className="w-full lg:w-1/2 h-full p-6 border border-primary--blue rounded-2xl">
              {errorMessage && <ErrorState error={errorMessage} />}

              {inEditMode ? (
                <>
                  <div className="w-full h-full flex flex-col gap-y-2">
                    <h1 className="heading">
                      How would you rate this product?
                    </h1>
                    <p className="paragraph">Choose from 0 to 10...</p>
                  </div>
                  <div className="w-full h-full my-8 grid grid-cols-4 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">
                    {[...Array(11)].map((_, i) => (
                      <div
                        key={i}
                        className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
                        onClick={() => setRateValue(i)}
                      >
                        <StarIcon
                          // className="w-14 md:w-20 xl:w-24 h-14 md:h-20 xl:h-24 duration-300"
                          className="w-12 lg:w-16 h-12 lg:h-16 duration-300"
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
                            "text-primary--blue font-bold"
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
                    <TextArea
                      label=""
                      id="comment-area"
                      name="comment-area"
                      value={enteredComment}
                      placeholder={
                        "Is something wrong with this product? Tell us about any improvements that should be made..."
                      }
                      onChange={handleCommentChange}
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
                    <div className="flex justify-center items-center gap-x-1">
                      <p className="paragraph">
                        You rated this product{" "}
                        <strong className="text-primary--orange">
                          {rateValue}
                        </strong>
                        /10
                      </p>
                      <StarIcon
                        fill="none"
                        stroke="currentColor"
                        className="w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 text-secondary--orange"
                      />
                    </div>
                  </div>
                  {enteredComment.length > 0 && (
                    <div className="w-full h-full my-10 flex flex-col gap-y-2">
                      <p className="paragraph text-primary--blue">
                        You also commented on it:
                      </p>
                      <em className="small-paragraph text-center italic">
                        {enteredComment}
                      </em>
                    </div>
                  )}

                  <div className="w-full h-full flex flex-col items-center justify-center gap-y-3">
                    <p className="small-paragraph text-secondary--orange">
                      Changed your opinion?
                    </p>
                    <button
                      className="button-blue duration-300"
                      onClick={() => setConfirmEditing(true)}
                    >
                      Edit rate
                    </button>
                  </div>

                  <Transition.Root show={confirmEditing} as={Fragment}>
                    <Dialog
                      as="div"
                      className="relative z-20"
                      initialFocus={cancelButtonRef}
                      onClose={() => setConfirmEditing(false)}
                    >
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="fixed inset-0 bg-[#000000] bg-opacity-75 transition-opacity" />
                      </Transition.Child>

                      <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-background--white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg px-4 pt-5 pb-4 sm:p-6 sm:pb-5">
                              <div className="w-full h-full flex flex-col items-center justify-center gap-y-4">
                                <p className="paragraph text-error--red">
                                  Warning
                                </p>
                                <p className="small-paragraph text-center">
                                  Are you sure you want to edit your rate for{" "}
                                  <span className="text-primary--blue">
                                    {productData.title}
                                  </span>
                                  ?
                                  <br />
                                  This includes the rate value and the comment.
                                  <br />
                                </p>
                                <div className="flex flex-col lg:flex-row-reverse justify-center items-center lg:items-end w-full lg:gap-x-3">
                                  <button
                                    className="button-blue duration-300"
                                    onClick={() => setInEditMode(true)}
                                  >
                                    Edit rate
                                  </button>
                                  <button
                                    className="button-blue mt-3 lg:mt-4 bg-background--white text-primary--blue  hover:bg-primary--blue hover:text-background--white duration-300"
                                    onClick={(
                                      e: React.MouseEvent<HTMLButtonElement>
                                    ) => {
                                      e.preventDefault();
                                      setConfirmEditing(false);
                                    }}
                                    ref={cancelButtonRef}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </Dialog>
                  </Transition.Root>
                </>
              )}
            </article>
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

    const products = org.products || [];

    return products.map((product: any) => ({
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
          // console.log(user.userRatedAt);
          return {
            ...user,
            userRatedAt: user.userRatedAt.toDate().toString(),
          };
        }),
      },
      orgId,
    },
    // revalidate: 1,
  };
};
