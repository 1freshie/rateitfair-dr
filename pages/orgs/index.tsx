import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { GetStaticProps } from "next";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import OrgCard from "../../components/cards/OrgCard";
import LoadingState from "../../components/states/LoadingState";

import { auth, db } from "../../firebaseApp";

interface Data {
  orgsData: DocumentData[];
}

// interface Params extends ParsedUrlQuery {
//   orgName: string;
// }

export default function OrgsPage({ orgsData }: Data) {
  // const [user, loading, error] = useAuthState(auth);

  const [orgList, setOrgList] = useState(orgsData);
  const [isLoading, setIsLoading] = useState(false);

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

      await updateDoc(userDoc, {
        role: userData.role,
        orgId: userData.orgId,
      });
    });

    await deleteDoc(orgDoc);

    const updatedOrgList = orgList.filter((org) => org.id !== orgId);

    setOrgList(updatedOrgList);

    setIsLoading(false);
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
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
