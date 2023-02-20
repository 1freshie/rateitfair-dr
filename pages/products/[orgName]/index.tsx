import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { GetStaticProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthState from "../../../components/AuthState/AuthState";
import LoadingSpinner from "../../../components/states/LoadingSpinner";

import ProductList from "../../../components/ProductList/ProductList";
import { auth, db } from "../../../firebaseApp";

interface Data {
  orgData: DocumentData;
}

interface Params extends ParsedUrlQuery {
  orgName: string;
}

export default function ProductsPage({ orgData }: Data) {
  const [user, loading, error] = useAuthState(auth);

  const [isLoading, setIsLoading] = useState(false);
  const [isAdminOrOrg, setIsAdminOrOrg] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function getUserInfo() {
      if (user) {
        const userDoc = doc(db, "users", user.uid);

        const userSnapshot = await getDoc(userDoc);

        const currUserData = userSnapshot.data() as DocumentData;

        if (
          currUserData.role === "Admin" ||
          (currUserData.role === orgData.name &&
            currUserData.orgId === orgData.id)
        ) {
          setIsAdminOrOrg(true);
        }
      }
    }

    getUserInfo();
    setIsLoading(false);
  }, [user]);

  if (loading || error) {
    return <AuthState />;
  }

  if (isLoading) {
    return (
      <div className="flex h-96 flex-1 justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`RateItFair - ${orgData.name} Products`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content={`Rate now the ${orgData.name} products!`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full h-full mt-10">
        <ProductList
          orgId={orgData.id}
          orgSlug={orgData.name.toLowerCase().replace(/\s/g, "")}
          products={orgData.products}
          isAdminOrOrg={isAdminOrOrg}
        />
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
          // console.log(user.userRatedAt);
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
  };
};
