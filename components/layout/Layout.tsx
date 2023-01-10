import NavbarNew from "../Navbar/NavbarNew";
import styles from "./Layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-5 px-7 md:py-10 md:px-14 min-h-screen bg-background--white font-Montserrat">
      <NavbarNew />
      <div className="h-full w-full">{children}</div>
    </div>
  );
}
