"use client";

import React, { useState, useEffect } from "react";
import { PiGooglePlayLogoLight } from "react-icons/pi";
import { TfiApple } from "react-icons/tfi";

export default function DownloadButtons() {
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
    <>
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
    </>
  );
}
