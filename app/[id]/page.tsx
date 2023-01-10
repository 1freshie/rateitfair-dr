import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import { db } from "../../firebase/firebaseApp";

export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 60,
  fetchCache = "auto",
  runtime = "nodejs",
  preferredRegion = "auto";

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const userDocRef = doc(db, "users", id);
  const userSnap = await getDoc(userDocRef);
  const userData = userSnap.data()!;

  return (
    <div className="flex flex-col flex-1 justify-center items-center w-full h-full">
      <ProfileCard userData={userData} />
    </div>
  );
}

export async function generateStaticParams() {
  const userRef = collection(db, "users");
  const userSnap = await getDocs(userRef);

  return userSnap.docs.map((doc) => ({
    id: doc.id,
  }));
}
