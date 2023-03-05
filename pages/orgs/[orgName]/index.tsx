import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ShortOrgCard from "../../../components/cards/ShortOrgCard";
import UserCard from "../../../components/cards/UserCard";
import ErrorState from "../../../components/states/ErrorState";
import LoadingState from "../../../components/states/LoadingState";

import { auth, db } from "../../../firebaseApp";

interface Data {
  orgData: DocumentData;
}

interface Params extends ParsedUrlQuery {
  orgName: string;
}

export default function OrgPage({ orgData }: Data) {
  const [user, loading, error] = useAuthState(auth);

  const [isVerifiedUser, setIsVerifiedUser] = useState(false);

  const [orgUsers, setOrgUsers] = useState(orgData.users);
  const [totalProducts, setTotalProducts] = useState<number>(
    orgData.products.length
  );

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

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

    async function updateOrgUsers() {
      if (!orgData.users) {
        setOrgUsers([]);
        return;
      }

      const users = await Promise.all(
        orgData.users.map(async (user: any) => {
          const userDoc = await getDoc(doc(db, "users", user.id));
          return userDoc.data();
        })
      );

      setOrgUsers(users);
    }

    updateOrgUsers();

    setIsLoading(false);
  }, [user]);

  if (loading || isLoading) {
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

  return (
    <>
      <Head>
        <title>{`RateItFair - ${orgData.name}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={`About ${orgData.name}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="self-center flex-1 flex flex-col items-center justify-center gap-y-8">
        <div className="w-64 h-64">
          <Image
            src={orgData.logoURL}
            alt="Org Logo"
            width={256}
            height={256}
            className="w-full h-full"
            priority={true}
          />
        </div>

        <div className="w-full flex flex-col lg:flex-row justify-between items-center lg:items-start gap-y-8 lg:gap-x-8">
          <article className="w-full h-full p-6 flex flex-col items-center gap-y-8 border border-primary--blue rounded-2xl">
            <h1 className="heading text-center">Users</h1>
            {orgUsers && orgUsers.length !== 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {orgUsers.map((orgUser: any) => (
                  <UserCard
                    key={orgUser.id}
                    userId={orgUser.id}
                    username={orgUser.username}
                    userEmail={orgUser.email}
                    userPhotoURL={orgUser.photoURL}
                  />
                ))}
              </div>
            ) : (
              <em className="paragraph text-secondary--gray">
                No users yet...
              </em>
            )}
          </article>

          <article className="w-full h-full p-6 flex flex-col justify-center items-center gap-y-8 border border-primary--blue rounded-2xl">
            <h1 className="heading text-center">Products</h1>

            {orgData.products && orgData.products.length !== 0 ? (
              <>
                {totalProducts > 2 ? (
                  <div className="w-full flex flex-col justify-center items-center gap-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {orgData.products
                        .slice(totalProducts - 2, totalProducts)
                        .map((product: any) => {
                          let rates = {
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
                          };

                          rates = product.rates;

                          let sum = 0;
                          let count = 0;

                          for (const [key, value] of Object.entries(rates)) {
                            if (value > 0) {
                              sum += Number(key) * value;
                              count += value;
                            }
                          }

                          let average = count > 0 ? sum / count : 0;

                          const averageRate = Math.round(average * 10) / 10;

                          return (
                            <ShortOrgCard
                              key={product.id}
                              orgSlug={orgData.name
                                .toLowerCase()
                                .replace(/\s/g, "")}
                              productId={product.id}
                              productTitle={product.title}
                              productImageURL={product.imageURL}
                              averageRate={averageRate}
                            />
                          );
                        })}
                    </div>
                    <div className="w-full flex flex-col justify-center items-center gap-y-2">
                      <span className="heading text-secondary--gray text-center">
                        ...
                      </span>
                      <p className="small-paragraph text-secondary--orange text-center">
                        <strong>{totalProducts - 2}</strong> more products...
                      </p>
                      <Link
                        href={`/products/${orgData.name
                          .toLowerCase()
                          .replace(/\s/g, "")}`}
                        className="button-blue duration-300"
                      >
                        See more
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {orgData.products.map((product: any) => {
                      let rates = {
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
                      };

                      rates = product.rates;

                      let sum = 0;
                      let count = 0;

                      for (const [key, value] of Object.entries(rates)) {
                        if (value > 0) {
                          sum += Number(key) * value;
                          count += value;
                        }
                      }

                      let average = count > 0 ? sum / count : 0;

                      const averageRate = Math.round(average * 10) / 10;

                      return (
                        <ShortOrgCard
                          key={product.id}
                          orgSlug={orgData.name
                            .toLowerCase()
                            .replace(/\s/g, "")}
                          productId={product.id}
                          productTitle={product.title}
                          productImageURL={product.imageURL}
                          averageRate={averageRate}
                        />
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <em className="paragraph text-secondary--gray">
                No products yet...
              </em>
            )}
          </article>
        </div>

        {/* <article className="w-full lg:w-auto h-full p-6 flex flex-col justify-center items-center gap-y-8 border border-primary--blue rounded-2xl">
          <h1 className="heading text-center">Products</h1>

          {orgData.products && totalProducts < 3 ? (
            
          )}

          // {orgData.products ? (
          //   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          //     {orgData.products.map((product: any) => {
          //       let rates = {
          //         0: 0,
          //         1: 0,
          //         2: 0,
          //         3: 0,
          //         4: 0,
          //         5: 0,
          //         6: 0,
          //         7: 0,
          //         8: 0,
          //         9: 0,
          //         10: 0,
          //       };

                rates = product.rates;

                let sum = 0;
                let count = 0;

                for (const [key, value] of Object.entries(rates)) {
                  if (value > 0) {
                    sum += Number(key) * value;
                    count += value;
                  }
                }

                let average = count > 0 ? sum / count : 0;

                const averageRate = Math.round(average * 10) / 10;

          //       return (
          //         // <Link
          //         //   href={`/${orgData.name
          //         //     .toLowerCase()
          //         //     .replace(/\s/g, "")}/products/${product.id}`}
          //         //   key={product.id}
          //         //   className="w-full h-full flex flex-col justify-center items-center gap-y-2 p-6 border border-primary--blue rounded-2xl"
          //         // >
          //         //   <div className="w-32 h-32">
          //         //     <Image
          //         //       src={product.imageURL}
          //         //       alt="Product Image"
          //         //       width={128}
          //         //       height={128}
          //         //       className="w-full h-full"
          //         //       priority={true}
          //         //     />
          //         //   </div>
          //         //   <h1 className="small-paragraph text-primary--blue text-center">
          //         //     {product.title}
          //         //   </h1>
          //         //   <div className="flex justify-center items-center text-center gap-x-1">
          //         //     <p className="small-paragraph text-secondary--orange">
          //         //       <span className="font-medium">{averageRate}</span>/10
          //         //     </p>
          //         //     <StarIcon
          //         //       fill="none"
          //         //       stroke="#f9ab55"
          //         //       className="w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 text-primary--orange"
          //         //     />
          //         //   </div>
          //         // </Link>
          //       );
          //     })}
          //   </div>
          // ) : (
          //   <em className="paragraph text-secondary--gray">
          //     No products yet...
          //   </em>
          // )}
        </article> */}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const orgsDocs = await getDocs(collection(db, "organizations"));

  const orgsData = orgsDocs.docs.map((org) => org.data());

  const paths = orgsData.map((orgData) => ({
    params: {
      orgName: orgData.name.toLowerCase().replace(/\s/g, ""),
    },
  }));

  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps<Data, Params> = async (context) => {
  const { params } = context;
  const { orgName } = params as Params;

  const orgsSnapshot = await getDocs(collection(db, "organizations"));

  const orgsData = orgsSnapshot.docs.map((org) => org.data());

  const orgId = orgsData.filter(
    (orgData) => orgData.name.toLowerCase().replace(/\s/g, "") === orgName
  )[0].id;

  const orgDoc = doc(db, "organizations", orgId);

  const orgSnapshot = await getDoc(orgDoc);

  const orgData = orgSnapshot.data() as DocumentData;

  let updatedOrgProducts: any;

  if (!orgData.products) {
    updatedOrgProducts = [];
  } else {
    updatedOrgProducts = orgData.products.map((product: any) => {
      if (!product.usersRated) {
        return {
          ...product,
          usersRated: [],
        };
      }

      return {
        ...product,
        usersRated: product.usersRated.map((user: any) => {
          return {
            ...user,
            userRatedAt: user.userRatedAt.toDate().toString(),
          };
        }),
      };
    });
  }

  return {
    props: {
      orgData: {
        ...orgData,
        products: updatedOrgProducts,
      },
    },
    revalidate: 10,
  };
};
