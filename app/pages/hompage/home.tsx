"use client";
import Image from "next/image";

import { PiGooglePlayLogoLight } from "react-icons/pi";
import { TfiApple } from "react-icons/tfi";
export default function HomePage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-screen">
      <div className="col-span-1 mx-8 h-1/2 md:h-screen flex flex-col  md:order-1 order-2">
        <div className="mt-5 hidden md:block">
          <Image
            src="/images/hasher-logo.svg"
            height={20}
            width={30}
            alt="hasher-logo"
          />
        </div>

        <div className="md:mt-auto md:mb-10  w-full">
          <div className=" ">
            <h1 className="font-bold text-3xl md:text-4xl w-full text-center md:text-left ">
              <span className="block"> Welcome to</span>
              <span className="block ">hasher.</span>
            </h1>
            <p className="opacity-75 w-full mx-8 md:mx-0 my-2">
              <span className="block md:inline-block">
                Join the community of smart and
              </span>
              <span className="block ">curious.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 mx-8 md:mx-0 gap-2 ">
            <button className="bg-black text-white  flex items-center justify-center gap-4 ">
              <span className="font-medium">APP STORE</span>
              <span>
                <TfiApple className="h-5 w-5" />
              </span>
            </button>
            <button className="border border-black flex items-center  justify-center gap-3 p-1 ">
              <span className="font-medium ">GOOGLE STORE</span>
              <span className="">
                <PiGooglePlayLogoLight className="h-5 w-5 " />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-2 order-1 md:order-2  md:h-screen">
        <div className="w-full h-full relative">
          <Image
            src="/images/home-image.png"
            alt="Hasher"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="absolute top-5 left-5 md:hidden">
          <Image
            src="/images/hasher-white-logo.svg"
            height={20}
            width={30}
            alt="hasher-logo"
          />
        </div>
      </div>
    </div>
  );
}
