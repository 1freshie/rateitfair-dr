import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseApp";

export async function updateProducts(orgId: string, products: any) {
  const orgsCollection = collection(db, "organizations");
  const orgDoc = doc(orgsCollection, orgId);

  await setDoc(
    orgDoc,
    {
      products: products,
    },
    { merge: true }
  );
}
