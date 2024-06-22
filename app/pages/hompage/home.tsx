import { Metadata } from "next";
import Image from "next/image";
import DownloadButtons from "./DownloadButtons";

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
    url: "https://yourdomain.com",
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

export default function HomePage() {
  return (
    <div className="flex flex-col md:grid md:grid-cols-3 h-screen">
      <div className="md:col-span-1 md:mx-8 flex flex-col md:order-1 order-2 p-4 md:p-0">
        <div className="mt-5 h-[45px] w-[45px] hidden md:block">
          <Image
            src="/images/hasher-logo.svg"
            height={50}
            width={50}
            alt="hasher-logo"
          />
        </div>

        <div className="md:mt-auto md:mb-10 w-full">
          <div>
            <h1 className="font-bold mt-4 md:mt-0 text-4xl md:text-6xl w-full text-center md:text-left">
              <span className="block">Welcome to</span>
              <span className="block">hasher.</span>
            </h1>
            <p className="opacity-75 text-xl w-full text-center md:text-left md:mx-0 my-6">
              <span className="block md:inline-block">
                Join the community of smart and curious.
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <DownloadButtons />
          </div>
        </div>
      </div>

      <div className="h-[44vh] md:h-screen md:col-span-2 order-1 md:order-2 relative">
        <Image
          src="/images/home-banner.jpg"
          alt="Hasher"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute top-6 left-5 md:hidden">
          <Image
            src="/images/hasher-white-logo.svg"
            height={40}
            width={40}
            alt="hasher-logo"
          />
        </div>
      </div>
    </div>
  );
}
