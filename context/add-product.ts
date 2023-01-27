import { uuidv4 } from "@firebase/util";
import { collection, doc, DocumentData, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseApp";

export async function addProduct(
  orgData: DocumentData | undefined,
  orgId: string,
  productName: string,
  productDescription: string,
  productImageURL: string
) {
  const productId = uuidv4();

  // navigate to the organizations collection with the orgId and then add the product to the products array
  const orgsCollection = collection(db, "organizations");
  const orgDoc = doc(orgsCollection, orgId);

  await setDoc(
    orgDoc,
    {
      products: [
        {
          id: productId,
          name: productName,
          description: productDescription,
          imageURL: productImageURL,
          comments: [
            // {
            //   userId: "",
            //   userEmail: "",
            //   comment: "",
            // },
          ],
          rates: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
          },
          ratesCount: 0,
        },
      ],
    },
    { merge: true }
  );
}
