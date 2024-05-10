import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "./widgets/Footer";
import Navbar from "./widgets/Navbar";
import { StoreProvieder } from "./store/StoreProvider";
import { usePathname } from "next/navigation";
const inter = Montserrat({ subsets: ["latin"] });
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Hasher",
  description: "Learn from the best",
  openGraph: {
    title: "Hasher",
    description: "Connect with experts and learn new skills",
    images: [
      {
        url: "https://example.com/default-image.jpg",
        width: 1200,
        height: 600,
        alt: "Hasher Platform",
      },
    ],
  },
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
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Navbar />
          <main className=" px-4 md:px-10">{children}</main>
          <Footer />
        </body>
      </html>
    </StoreProvieder>
  );
}
