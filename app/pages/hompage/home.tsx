"use client";
import Image from "next/image";
import { PiGooglePlayLogoLight } from "react-icons/pi";
import { TfiApple } from "react-icons/tfi";
import React, { useState, useEffect } from "react";

export default function HomePage() {
  const [platform, setPlatform] = useState<"ios" | "android" | "other">(
    "other"
  );
  const [appStoreUrl, setAppStoreUrl] = useState<string>("#");
  const [playStoreUrl, setPlayStoreUrl] = useState<string>("#");

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(userAgent);
    const isIos = /iphone|ipad|ipod/.test(userAgent);

    if (isAndroid) {
      setPlatform("android");
    } else if (isIos) {
      setPlatform("ios");
    } else {
      setPlatform("other");
    }

    setAppStoreUrl(
      "https://apps.apple.com/in/app/hasher-connect-with-experts/id6502012082"
    );
    setPlayStoreUrl(
      "https://play.google.com/store/apps/details?id=com.hasher.android"
    );
  }, []);

  const handleStoreClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    store: "appStore" | "playStore"
  ) => {
    e.preventDefault();
    let url: string;

    if (store === "appStore") {
      url =
        platform === "ios"
          ? "itms-apps://itunes.apple.com/app/id6502012082"
          : appStoreUrl;
    } else {
      url =
        platform === "android"
          ? "market://details?id=com.hasher.android"
          : playStoreUrl;
    }

    window.location.href = url;
  };

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
            <h1 className="font-bold mt-8 md:mt-0 text-4xl md:text-6xl w-full text-center md:text-left">
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
            <button
              onClick={(e) => handleStoreClick(e, "appStore")}
              className="bg-black py-4 text-white flex items-center justify-center gap-4 w-full"
            >
              <span className="font-medium">APP STORE</span>
              <span>
                <TfiApple className="h-5 w-5" />
              </span>
            </button>
            <button
              onClick={(e) => handleStoreClick(e, "playStore")}
              className="border py-4 border-black flex items-center justify-center gap-3 p-1 w-full"
            >
              <span className="font-medium">GOOGLE PLAY</span>
              <span>
                <PiGooglePlayLogoLight className="h-5 w-5" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="h-[40vh] md:h-screen md:col-span-2 order-1 md:order-2 relative">
        <Image
          src="/images/home-image.png"
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
