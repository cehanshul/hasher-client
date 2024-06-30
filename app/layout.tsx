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
  title: "Hasher - Connect with Experts",
  description:
    "Join the community of smart and curious. Connect with experts using the Hasher app.",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Hasher - Connect with Experts",
    description:
      "Join the community of smart and curious. Connect with experts using the Hasher app.",
    url: "https://hasher.lol",
    images: [
      {
        url: "/images/hasher-logo.svg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hasher - Connect with Experts",
    description:
      "Join the community of smart and curious. Connect with experts using the Hasher app.",
    images: [
      {
        url: "/images/hasher-logo.svg",
      },
    ],
  },
};

// export const metadata: Metadata = {
//   title: "Hasher",
//   description: "Learn from the best",
//   openGraph: {
//     title: "Hasher",
//     description: "Connect with experts and learn new skills",
//     images: [
//       {
//         url: "https://example.com/default-image.jpg",
//         width: 1200,
//         height: 600,
//         alt: "Hasher Platform",
//       },
//     ],
//   },
// };
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvieder>
      <html lang="en">
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <ToastContainer />

          {/* <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          /> */}
          {/* <Navbar /> */}
          <main className=" ">{children}</main>
          <Footer />
        </body>
      </html>
    </StoreProvieder>
  );
}
