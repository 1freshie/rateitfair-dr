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

import { auth, db } from "../../../firebaseApp";

interface Data {
  orgData: DocumentData;
}

interface Params extends ParsedUrlQuery {
  orgName: string;
}

export default function OrgPage({ orgData }: Data) {
  return (
    <div className="self-center justify-self-center flex flex-1 justify-center items-center"></div>
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
