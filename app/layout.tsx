import Navbar from '../components/Navbar/Navbar';
import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="py-5 px-7 md:py-10 md:px-14 min-h-screen bg-background--white font-Montserrat">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
