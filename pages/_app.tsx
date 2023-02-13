import type { AppProps } from "next/app";

import Layout from "../components/Layout/Layout";
import NavbarNew from "../components/Navbar/NavbarNew";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col py-5 px-7 md:py-10 md:px-14 bg-background--white font-Montserrat">
      <NavbarNew />
      <div className="flex flex-1">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
