import '../styles/globals.css';
import Navbar from '../components/Navbar/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-Montserrat">
      <body className="py-5 px-7 md:py-10 md:px-14 h-screen max-h-screen bg-background--white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
