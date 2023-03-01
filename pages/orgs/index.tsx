import {
  collection,
  deleteDoc,
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
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import OrgCard from "../../components/cards/OrgCard";
import ErrorState from "../../components/states/ErrorState";
import LoadingState from "../../components/states/LoadingState";
import { auth, db, storage } from "../../firebaseApp";

interface Data {
  orgsData: DocumentData[];
}

// interface Params extends ParsedUrlQuery {
//   orgName: string;
// }

export default function OrgsPage({ orgsData }: Data) {
  const [user, loading, error] = useAuthState(auth);

  const router = useRouter();

  const [isVerifiedUser, setIsVerifiedUser] = useState(false);

  const [orgList, setOrgList] = useState(orgsData);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  async function handleDeleteOrg(orgId: string) {
    setIsLoading(true);

    const orgDoc = doc(db, "organizations", orgId);

    const orgSnapshot = await getDoc(orgDoc);

    const currOrgData = orgSnapshot.data() as DocumentData;

    const usersDocs = await getDocs(collection(db, "users"));

    const usersData = usersDocs.docs.map((user) => user.data());

    const updatedUsersData = usersData.map((userData) => {
      if (userData.orgId === orgId && userData.role === currOrgData.name) {
        return {
          ...userData,
          role: "User",
          orgId: "",
        };
      } else {
        return userData;
      }
    });

    updatedUsersData.forEach(async (userData) => {
      const userDoc = doc(db, "users", userData.id);

      try {
        await updateDoc(userDoc, {
          role: userData.role,
          orgId: userData.orgId,
        });
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    });

    try {
      await deleteDoc(orgDoc);
    } catch (error: any) {
      setErrorMessage(error.message);
    }

    const storageRef = ref(storage, `organizations/${orgId}/logo`);

    try {
      await deleteObject(storageRef);
    } catch (error: any) {
      setErrorMessage(error.message);
    }

    const updatedOrgList = orgList.filter((org) => org.id !== orgId);

    setOrgList(updatedOrgList);

    setIsLoading(false);
    setErrorMessage("");
  }

  return (
    <>
      <Head>
        <title>RateItFair - Orgs</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Organizations that use RateItFair to get feedback on their products."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {errorMessage && (
        <p className="self-center text-center flex flex-1 justify-center items-center text-error--red">
          {errorMessage}
        </p>
      )}
      <div className="w-full h-full mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {orgList.map((orgData) => (
          <OrgCard
            key={orgData.id}
            orgId={orgData.id}
            orgName={orgData.name}
            orgLogoURL={orgData.logoURL}
            orgProductsCount={orgData.products.length}
            orgUsersCount={orgData.users ? orgData.users.length : 0}
            deleteOrg={handleDeleteOrg}
          />
        ))}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Data> = async (context) => {
  const orgsDocs = await getDocs(collection(db, "organizations"));

  const orgsData = orgsDocs.docs.map((org) => org.data());

  const updatedOrgsData = orgsData.map((orgData) => {
    if (!orgData.products) {
      return {
        ...orgData,
        products: [],
      };
    }

    return {
      ...orgData,
      products: orgData.products.map((product: any) => {
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
      }),
    };
  });

  return {
    props: {
      orgsData: updatedOrgsData,
    },
  };
};
