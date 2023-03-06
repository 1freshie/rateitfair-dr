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

import ProfileCard from "../../../components/cards/ProfileCard";
import AddOrganizationModal from "../../../components/modals/AddOrganizationModal";
import AddProductModal from "../../../components/modals/AddProductModal";
import RecentlyRatedProductsModal from "../../../components/modals/RecentlyRatedProductsModal";
import RoleActivityButton from "../../../components/RoleActivity/RoleActivityButton";
import ErrorState from "../../../components/states/ErrorState";
import LoadingState from "../../../components/states/LoadingState";
import { auth, db } from "../../../firebaseApp";

interface Data {
  userData: DocumentData;
  orgData?: DocumentData;
  availableUsers: DocumentData[];
}

interface Params extends ParsedUrlQuery {
  userId: string;
}

// TODO: ADD CONFIRMATION BUTTON FOR ALL FORMS

export default function ProfilePage({
  userData,
  orgData,
  availableUsers,
}: Data) {
  const [user, loading, error] = useAuthState(auth);

  const router = useRouter();

  const [isVerifiedUser, setIsVerifiedUser] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  if (loading || isLoading) return <LoadingState />;

  if (error) return <ErrorState error={error.message} />;

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

  if (!user) {
    router.push("/login");
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  if (!userData) return <ErrorState error="Something went wrong!" />;

  return (
    <>
      <Head>
        <title>{`RateItFair - ${userData.username}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Your RateItFair profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`relative w-full h-full self-center flex flex-1 flex-col justify-center items-center ${
          isOpen ? "-z-20" : "z-0"
        }`}
      >
        <ProfileCard userData={userData} />
        <RoleActivityButton userRole={userData.role} openModal={openModal} />
        {userData.role !== "User" &&
          userData.role !== "Admin" &&
          userData.orgId.length > 0 && (
            <AddProductModal
              orgId={userData.orgId}
              isOpen={isOpen}
              closeModal={closeModal}
            />
          )}
        {userData.role === "Admin" && (
          <AddOrganizationModal
            availableUsers={availableUsers}
            isOpen={isOpen}
            closeModal={closeModal}
          />
        )}
        {userData.role === "User" && !userData.orgId && (
          <RecentlyRatedProductsModal
            ratedProducts={userData.ratedProducts}
            isOpen={isOpen}
            closeModal={closeModal}
          />
        )}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const usersCollection = collection(db, "users");

  const usersSnapshot = await getDocs(usersCollection);

  const usersDocs = usersSnapshot.docs;

  const paths = usersDocs.map((userDoc) => ({
    params: {
      userId: userDoc.id,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<Data, Params> = async (context) => {
  const { params } = context;
  const { userId } = params as Params;

  const userDoc = doc(db, "users", userId);

  const userSnapshot = await getDoc(userDoc);

  const userData = userSnapshot.data() as DocumentData;

  let userRatedProducts;

  if (userData.ratedProducts) {
    userRatedProducts = userData.ratedProducts;
  } else {
    userRatedProducts = [];
  }

  const updatedRatedProducts = userRatedProducts.map((ratedProduct: any) => {
    return {
      ...ratedProduct,
      ratedAt: ratedProduct.ratedAt.toDate().toString(),
    };
  });

  const datedRatedProducts = updatedRatedProducts.map((ratedProduct: any) => {
    return {
      ...ratedProduct,
      ratedAt: new Date(ratedProduct.ratedAt),
    };
  });

  const sortedRatedProducts = datedRatedProducts.sort(
    (a: any, b: any) => b.ratedAt.getTime() - a.ratedAt.getTime()
  );

  const ratedProducts = sortedRatedProducts.map((ratedProduct: any) => {
    return {
      ...ratedProduct,
      ratedAt: ratedProduct.ratedAt.toLocaleString(),
    };
  });

  const usersCollection = collection(db, "users");

  const usersDocs = await getDocs(usersCollection);

  const users = usersDocs.docs.map((doc) => doc.data());

  const filteredUsers = users.filter(
    (user) => user.orgId === "" && user.role !== "Admin"
  );

  const updatedFilteredUsers: DocumentData[] = filteredUsers.map((user) => {
    if (user.ratedProducts) {
      return {
        ...user,
        ratedProducts: user.ratedProducts.map((ratedProduct: any) => {
          return {
            ...ratedProduct,
            ratedAt: ratedProduct.ratedAt.toDate().toString(),
          };
        }),
        isAvailable: true,
      };
    } else {
      return {
        ...user,
        ratedProducts: [],
        isAvailable: true,
      };
    }
  });

  // updatedFilteredUsers.push({
  //   id: "1",
  //   email: "test@test.com",
  //   isAvailable: true,
  //   username: "Test User",
  //   photoURL: "https://via.placeholder.com/18",
  // });

  // updatedFilteredUsers.push({
  //   id: "23",
  //   email: "test23@test.com",
  //   isAvailable: true,
  //   username: "Test User 23",
  //   photoURL: "https://via.placeholder.com/18",
  // });

  return {
    props: {
      userData: {
        ...userData,
        ratedProducts: ratedProducts,
      },
      availableUsers: updatedFilteredUsers,
    },
    // revalidate: 1,
  };
};
