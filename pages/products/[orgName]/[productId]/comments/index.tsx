import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthState from "../../../../../components/AuthState/AuthState";

import { auth, db } from "../../../../../firebase/firebaseApp";

export default function ProductCommentsPage() {
  const [user, loading, error] = useAuthState(auth);

  const router = useRouter();

  const [usersRated, setUsersRated] = useState<
    [
      {
        userId: string;
        userRate: number;
        userComment: string;
        userRatedAt: Timestamp;
      }
    ]
  >([
    {
      userId: "",
      userRate: 0,
      userComment: "",
      userRatedAt: Timestamp.now(),
    },
  ]);

  const { orgName, productId } = router.query;

  useEffect(() => {
    async function fetchUsersRated() {
      if (user) {
        const orgsSnapshot = await getDocs(collection(db, "organizations"));
        const orgsData = orgsSnapshot.docs.map((doc) => doc.data());

        const orgId = orgsData.filter(
          (orgData) => orgData.name.toLowerCase().replace(/\s/g, "") === orgName
        )[0].id;

        const orgDoc = doc(db, "organizations", orgId);

        const orgSnapshot = await getDoc(orgDoc);

        const orgData = orgSnapshot.data() as DocumentData;

        const updatedOrgProducts = orgData.products.map((product: any) => {
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

        const product = updatedOrgProducts.filter(
          (product: any) => product.id === productId
        )[0];

        setUsersRated(product.usersRated);
      }
    }

    fetchUsersRated();
  }, [user, orgName, productId]);

  if (loading || error) {
    return <AuthState />;
  }

  console.log(usersRated);

  return <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">

  </div>;
}
