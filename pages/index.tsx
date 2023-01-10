// import type { NextPage } from 'next';
// import Image from 'next/image';

import { NextPage } from "next";
import Head from "next/head";
import StarRow from "../components/StarRow/StarRow";

// const Home: NextPage = () => {
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center py-2">
//       <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
//         <h1 className="text-6xl font-bold">
//           Welcome to{' '}
//           <a className="text-blue-600" href="https://nextjs.org">
//             Next.js!
//           </a>
//         </h1>

//         <p className="mt-3 text-2xl">
//           Get started by editing{' '}
//           <code className="rounded-md bg-gray-100 p-3 font-mono text-lg">
//             pages/index.tsx
//           </code>
//         </p>

//         <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
//           <a
//             href="https://nextjs.org/docs"
//             className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
//           >
//             <h3 className="text-2xl font-bold">Documentation &rarr;</h3>
//             <p className="mt-4 text-xl">
//               Find in-depth information about Next.js features and its API.
//             </p>
//           </a>

//           <a
//             href="https://nextjs.org/learn"
//             className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
//           >
//             <h3 className="text-2xl font-bold">Learn &rarr;</h3>
//             <p className="mt-4 text-xl">
//               Learn about Next.js in an interactive course with quizzes!
//             </p>
//           </a>

//           <a
//             href="https://github.com/vercel/next.js/tree/canary/examples"
//             className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
//           >
//             <h3 className="text-2xl font-bold">Examples &rarr;</h3>
//             <p className="mt-4 text-xl">
//               Discover and deploy boilerplate example Next.js projects.
//             </p>
//           </a>

//           <a
//             href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
//           >
//             <h3 className="text-2xl font-bold">Deploy &rarr;</h3>
//             <p className="mt-4 text-xl">
//               Instantly deploy your Next.js site to a public URL with Vercel.
//             </p>
//           </a>
//         </div>
//       </main>

//       <footer className="flex h-24 w-full items-center justify-center border-t">
//         <a
//           className="flex items-center justify-center gap-2"
//           href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Powered by{' '}
//           <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
//         </a>
//       </footer>
//     </div>
//   );
// };

// export default Home;

export default function HomePage() {
  return (
    <>
      <Head>
        <title>RateItFair - Home</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="RateItFair is a platform where you can rate your favourite products and share your opinion with the world!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full h-full flex flex-1 flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col items-start justify-center w-full md:w-1/2 gap-y-8 text-center md:text-left">
          <h1 className="heading font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            Rate whatever you want. Whenever you want
          </h1>
          <p className="paragraph">
            We have a large list of your favourite companies' products. Rate the
            ones you used and share your opinion! Be a part of them improving!
          </p>
        </div>
        <div className="mt-9 md:mt-0 flex flex-row items-center justify-evenly w-full md:w-1/2">
          <StarRow stars={4} />
        </div>
      </main>
    </>
  );
}
