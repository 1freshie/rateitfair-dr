import Head from "next/head";
import StarRow from "../components/StarRow/StarRow";

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

      <main className="w-full h-full mt-20 md:mt-28 lg:mt-36 flex flex-1 flex-col md:flex-row items-center justify-between">
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
