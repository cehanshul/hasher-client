import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "./widgets/Footer";
import Navbar from "./widgets/Navbar";
import { StoreProvieder } from "./store/StoreProvider";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hasher",
  description: "Learn from the best",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvieder>
      <html lang="en">
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <div className="fixed top-0 left-0 right-0 z-10">
            <Navbar />
          </div>
          <main className="flex-gro flex flex-col justify-center items-center p-4 md:px-10 pt-20">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </StoreProvieder>
  );
}
