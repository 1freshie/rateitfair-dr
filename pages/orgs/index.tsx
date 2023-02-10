import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import OrgCard from "../../components/Cards/OrgCard";

import { auth, db } from "../../firebase/firebaseApp";

interface Data {
  orgsData: DocumentData[];
}

// interface Params extends ParsedUrlQuery {
//   orgName: string;
// }

export default function OrgsPage({ orgsData }: Data) {
  return (
    <div className="w-full h-full mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {orgsData.map((orgData) => (
        <OrgCard
          key={orgData.id}
          orgId={orgData.id}
          orgName={orgData.name}
          orgLogoURL={orgData.logoURL}
          orgProductsCount={orgData.products.length}
          orgUsersCount={orgData.users ? orgData.users.length : 0}
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
