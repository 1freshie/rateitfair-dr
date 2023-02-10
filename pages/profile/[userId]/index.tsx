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
import { useState } from "react";
import AddOrganizationModal from "../../../components/Modals/AddOrganizationModal";
import AddProductModal from "../../../components/Modals/AddProductModal";
import RecentlyRatedProductsModal from "../../../components/Modals/RecentlyRatedProductsModal";
import ProfileCardNew from "../../../components/ProfileCard/ProfileCardNew";
import RoleActivityButton from "../../../components/RoleActivity/RoleActivityButton";
import { db } from "../../../firebase/firebaseApp";

interface Data {
  userData: DocumentData;
  orgData?: DocumentData;
  availableUsers: DocumentData[];
}

interface Params extends ParsedUrlQuery {
  userId: string;
}

// TODO: ADD CONFIRMATION BUTTON FOR ALL FORMS => ADD ORG AND ADD PRODUCT FORMS MUST NOT BE IN MODAL BUT IN A SEPARATE PAGE (CONFIRM MESSAGE WILL BE MODAL POPUP)

export default function ProfilePage({
  userData,
  orgData,
  availableUsers,
}: Data) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  if (!userData)
    return (
      <div className="flex h-96 flex-1 justify-center items-center">
        <p className="paragraph text-center text-error--red">
          Error | Something went wrong.
        </p>
      </div>
    );

  return (
    <>
      <Head>
        <title>{`RateItFair - ${userData.username}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Your RateItFair profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`relative w-full h-full flex flex-1 flex-col items-center mt-10 ${
          isOpen && "-z-20"
        }`}
      >
        <ProfileCardNew userData={userData} />
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
        {/* TODO: View rated products list on role === "User" */}
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

  // filter the users and set the ratedProducts object array with property ratedAt as a string
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
    revalidate: 1,
  };
};
