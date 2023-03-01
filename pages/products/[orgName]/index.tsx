import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import ProductCard from "../../../components/cards/ProductCard";
import ErrorState from "../../../components/states/ErrorState";
import LoadingState from "../../../components/states/LoadingState";
import { auth, db, storage } from "../../../firebaseApp";

interface Data {
  orgData: DocumentData;
}

interface Params extends ParsedUrlQuery {
  orgName: string;
}

export default function ProductsPage({ orgData }: Data) {
  const [user, loading, error] = useAuthState(auth);

  const [productList, setProductList] = useState(orgData.products);

  const [isVerifiedUser, setIsVerifiedUser] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isAdminOrOrg, setIsAdminOrOrg] = useState(false);

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

  async function handleDeleteProduct(productId: string) {
    setIsLoading(true);

    const orgRef = doc(collection(db, "organizations"), orgData.id);

    const products = orgData.products.filter(
      (product: DocumentData) => product.id !== productId
    );

    try {
      await updateDoc(orgRef, {
        products,
      });
    } catch (error: any) {
      return <ErrorState error={error.message} />;
    }

    const userRef = doc(collection(db, "users"), user!.uid);

    const userDoc = await getDoc(userRef);

    const userData = userDoc.data() as DocumentData;

    const ratedProducts = userData.ratedProducts.filter(
      (product: DocumentData) => product.productId !== productId
    );

    try {
      await updateDoc(userRef, {
        ratedProducts,
      });
    } catch (error: any) {
      return <ErrorState error={error.message} />;
    }

    const storageRef = ref(
      storage,
      `organizations/${orgData.id}/products/${productId}/productImage`
    );

    try {
      await deleteObject(storageRef);
    } catch (error: any) {
      return <ErrorState error={error.message} />;
    }

    setProductList(products);

    setIsLoading(false);
    // router.reload();
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
        {productList && productList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center items-center">
            {productList.map((product: any, index: number) => (
              <ProductCard
                key={index}
                orgId={orgData.id}
                orgSlug={orgData.name.toLowerCase().replace(/\s/g, "")}
                id={product.id}
                title={product.title}
                rates={product.rates}
                // description={product.description}
                ratesCount={product.ratesCount}
                imageURL={product.imageURL}
                isAdminOrOrg={isAdminOrOrg}
                deleteProduct={handleDeleteProduct}
              />
            ))}
          </div>
        ) : (
          <em className="paragraph text-secondary--gray text-center">
            No available products yet!
          </em>
        )}
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
