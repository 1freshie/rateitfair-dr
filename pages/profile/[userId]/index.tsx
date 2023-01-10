import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import ProfileCardNew from "../../../components/ProfileCard/ProfileCardNew";
import { db } from "../../../firebase/firebaseApp";

interface UserData {
  userData: DocumentData;
}

interface Params extends ParsedUrlQuery {
  userId: string;
}

export default function ProfilePage({ userData }: UserData) {
  return <ProfileCardNew userData={userData} />;
}

export async function getStaticPaths() {
  const usersCollection = collection(db, "users");

  const usersSnapshot = await getDocs(usersCollection);

  const usersDocs = usersSnapshot.docs;

  return {
    paths: usersDocs.map((userDoc) => ({
      params: {
        userId: userDoc.id,
      },
    })),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<UserData, Params> = async (
  context
) => {
  const { params } = context;
  const { userId } = params!;

  const userDoc = doc(db, "users", userId);

  const userSnapshot = await getDoc(userDoc);

  const userData = userSnapshot.data()!;

  return {
    props: {
      userData: {
        ...userData,
        createdAt: userData.createdAt.toString(),
      },
    },
  };
};
