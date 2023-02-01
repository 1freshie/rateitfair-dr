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
import AddOrganizationForm from "../../../components/Forms/AddOrganizationForm";
import AddProductForm from "../../../components/Forms/AddProductForm";
import ProfileCardNew from "../../../components/ProfileCard/ProfileCardNew";
import RoleActivityButton from "../../../components/RoleActivity/RoleActivityButton";
import { db } from "../../../firebase/firebaseApp";

interface Data {
  userData: DocumentData;
  orgData?: DocumentData;
}

interface Params extends ParsedUrlQuery {
  userId: string;
}

export default function ProfilePage({ userData, orgData }: Data) {
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
        <title>RateItFair - Profile</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Your RateItFair profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`relative w-full h-full flex flex-1 flex-col items-center mt-14 lg:mt-24 ${
          isOpen && "-z-20"
        }`}
      >
        <ProfileCardNew userData={userData} />
        <RoleActivityButton userRole={userData.role} openModal={openModal} />
        {userData.role !== "User" && userData.role !== "Admin" && (
          <AddProductForm
            orgId={userData.orgId}
            isOpen={isOpen}
            closeModal={closeModal}
          />
        )}
        {userData.role === "Admin" && (
          <AddOrganizationForm isOpen={isOpen} closeModal={closeModal} />
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

  // let orgData: DocumentData = {};

  // if (userData.role !== "User" && userData.role !== "Admin") {
  //   const orgDoc = doc(db, "organizations", userData.orgId);

  //   const orgSnapshot = await getDoc(orgDoc);

  //   orgData = orgSnapshot.data()!;
  // }

  return {
    props: {
      // userData: {
      //   ...userData,
      //   // createdAt: userData.createdAt.toString(),
      // },
      userData,
    },
    revalidate: 1,
  };
};
