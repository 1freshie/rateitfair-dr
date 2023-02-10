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
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import AuthState from "../../../../../components/AuthState/AuthState";
import ProductCommentCard from "../../../../../components/ProductCommentCard/ProductCommentCard";
import { auth, db } from "../../../../../firebase/firebaseApp";

interface Data {
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

export default function ProductCommentsPage({ usersRated }: Data) {
  const [user, loading, error] = useAuthState(auth);

  const router = useRouter();

  // const [usersRated, setUsersRated] = useState<
  //   [
  //     {
  //       userId: string;
  //       userRate: number;
  //       userComment: string;
  //       userRatedAt: Timestamp;
  //     }
  //   ]
  // >([
  //   {
  //     userId: "",
  //     userRate: 0,
  //     userComment: "",
  //     userRatedAt: Timestamp.now(),
  //   },
  // ]);

  const { orgName, productId } = router.query;

  // useEffect(() => {
  //   async function fetchUsersRated() {
  //     if (user) {
  //       const orgsSnapshot = await getDocs(collection(db, "organizations"));
  //       const orgsData = orgsSnapshot.docs.map((doc) => doc.data());

  //       const orgId = orgsData.filter(
  //         (orgData) => orgData.name.toLowerCase().replace(/\s/g, "") === orgName
  //       )[0].id;

  //       const orgDoc = doc(db, "organizations", orgId);

  //       const orgSnapshot = await getDoc(orgDoc);

  //       const orgData = orgSnapshot.data() as DocumentData;

  //       const updatedOrgProducts = orgData.products.map((product: any) => {
  //         if (!product.usersRated) {
  //           return {
  //             ...product,
  //             usersRated: [],
  //           };
  //         }

  //         return {
  //           ...product,
  //           usersRated: product.usersRated.map((user: any) => {
  //             return {
  //               ...user,
  //               userRatedAt: user.userRatedAt.toString(),
  //             };
  //           }),
  //         };
  //       });

  //       const product = updatedOrgProducts.filter(
  //         (product: any) => product.id === productId
  //       )[0];

  //       setUsersRated(product.usersRated);
  //     }
  //   }

  //   fetchUsersRated();
  // }, [user, orgName, productId]);

  if (loading || error) {
    return <AuthState />;
  }

  return (
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
  );
}

export const getStaticPaths = async () => {
  const orgsSnapshot = await getDocs(collection(db, "organizations"));

  const orgsData = orgsSnapshot.docs.map((doc) => doc.data());

  const paths = orgsData.map((orgData) => {
    const orgName = orgData.name.toLowerCase().replace(/\s/g, "");

    const products = orgData.products;

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
    console.log(user.userRatedAt);
    return {
      ...user,
      userRatedAt: user.userRatedAt.toLocaleString(),
    };
  });

  return {
    props: {
      // usersRated: product.usersRated,
      usersRated,
    },
  };
};
