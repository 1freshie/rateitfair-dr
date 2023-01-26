import { collection, doc, setDoc } from "firebase/firestore";
import { uuidv4 } from "@firebase/util";
import { db } from "../firebase/firebaseApp";

export async function addOrg(orgName: string) {
  const orgId = uuidv4();

  const orgsCollection = collection(db, "organizations");

  await setDoc(doc(orgsCollection, orgId), {
    id: orgId,
    name: orgName,
    products: [
      // {
      //   id: "",
      //   name: "",
      //   description: "",
      //   price: 0,
      //   rating: 0,
      //   ratingCount: 0,
      //   imageUrl: "",
      //   createdAt: new Date(),
      // },
    ],
    // users: [
    //   {
    //     id: "",
    //     email: "",
    //   },
    // ],
  });
}