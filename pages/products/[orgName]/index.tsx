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

import ProductList from "../../../components/ProductList/ProductList";
import { db } from "../../../firebase/firebaseApp";

// const products = [
//   {
//     title: "AMD Ryzen 5 2600",
//     description: "Rate it for the first time!",
//     image:
//       "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
//     isRatedAlready: false,
//   },
//   {
//     title: "AMD Ryzen 5 2600",
//     description: "Already rated! Want to change it?",
//     image:
//       "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
//     isRatedAlready: true,
//   },
//   {
//     title: "AMD Ryzen 5 2600",
//     description: "Rate it for the first time!",
//     image:
//       "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
//     isRatedAlready: false,
//   },
//   {
//     title: "AMD Ryzen 5 2600",
//     description: "Already rated! Want to change it?",
//     image:
//       "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
//     isRatedAlready: true,
//   },
//   {
//     title: "AMD Ryzen 5 2600",
//     description: "Rate it for the first time!",
//     image:
//       "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
//     isRatedAlready: false,
//   },
//   {
//     title: "AMD Ryzen 5 2600",
//     description: "Already rated! Want to change it?",
//     image:
//       "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
//     isRatedAlready: true,
//   },
//   {
//     title: "AMD Ryzen 5 2600",
//     description: "Rate it for the first time!",
//     image:
//       "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
//     isRatedAlready: false,
//   },
//   {
//     title: "AMD Ryzen 5 2600",
//     description: "Already rated! Want to change it?",
//     image:
//       "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
//     isRatedAlready: true,
//   },
// ];

interface Data {
  orgData: DocumentData;
}

interface Params extends ParsedUrlQuery {
  orgName: string;
}

export default function ProductsPage({ orgData }: Data) {
  // console.log(orgData.products);
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
          org={orgData.name.toLowerCase().replace(/\s/g, "")}
          products={orgData.products}
        />
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const orgsDocs = await getDocs(collection(db, "organizations"));

  const orgsData = orgsDocs.docs.map((org) => org.data());

  const orgsNames = orgsData.map((orgData) =>
    orgData.name.toLowerCase().replace(/\s/g, "")
  );

  const paths = orgsNames.map((orgName) => ({
    params: { orgName },
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

  // if (orgData.products) {
  //   orgProductUsersRated = orgData.products.map((product: any) => {
  //     return product.usersRated;
  //   });

  //   if (!orgProductUsersRated) {
  //     orgProductUsersRated = [];
  //   } else {
  //     orgProductUsersRated = orgProductUsersRated.map((usersRated: any) => {
  //       return usersRated.map((user: any) => {
  //         return {
  //           ...user,
  //           userRatedAt: user.userRatedAt.toString(),
  //         };
  //       });
  //     });
  //   }

  //   updatedOrgProducts = orgData.products.map((product: any, index: number) => {
  //     return {
  //       ...product,
  //       usersRated: orgProductUsersRated[index],
  //     };
  //   });
  // } else {
  //   updatedOrgProducts = [];
  // }

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
            userRatedAt: user.userRatedAt.toString(),
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

  // updatedOrgProducts = orgData.products.map((product: any, index: number) => {
  //   return {
  //     ...product,
  //     usersRated: orgProductUsersRated[index].map((user: any) => {
  //       return {
  //         ...user,
  //         userRatedAt: user.userRatedAt.toString(),
  //       };
  //     }),
  //   };
  // });

  // return {
  //   props: {
  //     orgData: {
  //       ...orgData,
  //       products: updatedOrgProducts,
  //     },
  //   },
  //   revalidate: 1,
  // };
};
