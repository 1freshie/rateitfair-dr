import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseApp";

import Navbar from "../components/Navbar/Navbar";
import "../styles/globals.css";

export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 60,
  fetchCache = "auto",
  runtime = "nodejs",
  preferredRegion = "auto";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { id } = params;
  console.log(id);

  return (
    <html lang="en">
      <body className="py-5 px-7 md:py-10 md:px-14 min-h-screen bg-background--white font-Montserrat">
        <Navbar userId={id} />
        {children}
      </body>
    </html>
  );
}

// export async function generateStaticParams() {
//   const userRef = collection(db, "users");
//   const userSnap = await getDocs(userRef);

//   return userSnap.docs.map((doc) => ({
//     id: doc.id,
//   }));
// }

export async function generateStaticParams() {
  const userRef = collection(db, "users");
  const userSnap = await getDocs(userRef);

  userSnap.docs.map((doc) => {
    console.log(doc.id);
  });

  return userSnap.docs.map((doc) => ({
    id: doc.id,
  }));
}
