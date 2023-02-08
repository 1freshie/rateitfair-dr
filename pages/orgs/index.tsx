import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import OrgCard from "../../components/OrgCard/OrgCard";

import { auth, db } from "../../firebase/firebaseApp";

interface Data {
  orgs: DocumentData[];
}

// interface Params extends ParsedUrlQuery {
//   orgName: string;
// }

export default function OrgsPage({ orgs }: Data) {
  return (
    <div className="w-full h-full mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {orgs.map((org) => (
        <OrgCard
          orgId={org.id}
          orgName={org.name}
          orgProductsCount={org.products.length}
          orgUsersCount={3}
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
      orgs: updatedOrgsData,
    },
  };
};
