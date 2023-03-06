import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import ProductCommentCard from "../../../../../components/cards/ProductCommentCard";
import ErrorState from "../../../../../components/states/ErrorState";
import LoadingState from "../../../../../components/states/LoadingState";
import { auth, db } from "../../../../../firebaseApp";

interface Data {
  productTitle: string;
  usersRated: {
    userId: string;
    userRate: number;
    userComment: string;
    userRatedAt: string;
    userEmail: string;
  }[];
}

interface Params extends ParsedUrlQuery {
  orgName: string;
  productId: string;
}

export default function ProductCommentsPage({
  productTitle,
  usersRated,
}: Data) {
  const [user, loading, error] = useAuthState(auth);

  const [isVerifiedUser, setIsVerifiedUser] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // const { orgName, productId } = router.query;

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
        <title>{`RateItFair - ${productTitle} Comments`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Organizations that use RateItFair to get feedback on their products."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full h-full mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {usersRated.map((userRated) => (
          <ProductCommentCard
            key={userRated.userId}
            userId={userRated.userId}
            userComment={userRated.userComment}
            userRate={userRated.userRate}
            userEmail={userRated.userEmail}
            userRatedAt={userRated.userRatedAt}
          />
        ))}
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  const orgsSnapshot = await getDocs(collection(db, "organizations"));

  const orgsData = orgsSnapshot.docs.map((doc) => doc.data());

  const paths = orgsData.map((orgData) => {
    const orgName = orgData.name.toLowerCase().replace(/\s/g, "");

    const products = orgData.products || [];

    const productPaths = products.map((product: any) => {
      return {
        params: {
          orgName,
          productId: product.id,
        },
      };
    });

    return productPaths;
  });

  return {
    paths: paths.flat(),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Data, Params> = async (context) => {
  const { params } = context;
  const { orgName, productId } = params as Params;

  const orgsSnapshot = await getDocs(collection(db, "organizations"));

  const orgsData = orgsSnapshot.docs.map((doc) => doc.data());

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

  const product = updatedOrgProducts.filter(
    (product: any) => product.id === productId
  )[0];

  const datedUsersRated = product.usersRated.map((user: any) => {
    return {
      ...user,
      userRatedAt: new Date(user.userRatedAt),
    };
  });

  const sortedUsersRated = datedUsersRated.sort(
    (a: any, b: any) => b.userRatedAt.getTime() - a.userRatedAt.getTime()
  );

  // const sortedUsersRated = product.usersRated.sort(
  //   (a: any, b: any) => b.userRate - a.userRate
  // );

  const usersRated = sortedUsersRated.map((user: any) => {
    return {
      ...user,
      userRatedAt: user.userRatedAt.toLocaleString(),
    };
  });

  return {
    props: {
      // usersRated: product.usersRated,
      productTitle: product.title,
      usersRated,
    },
    // revalidate: 1,
  };
};
