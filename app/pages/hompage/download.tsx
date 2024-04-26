import Image from "next/image";
import React from "react";

const Downlaod = () => {
  return (
    <div className="max-w-4xl justify-between mx-auto">
      <h1 className="text-4xl font-bold">Learn from the best</h1>{" "}
      <p className="text-xl w-4/5 md:w-1/2 mt-2 text-[#ababab]">
        Join the community of smart and curious
      </p>
      <div className="md:flex gap-4 mt-10">
        <div className="bg-[#F5F5F5] text-center px-6 pt-6 w-full">
          <h2 className="text-2xl font-bold">iOS</h2>
          <button className="bg-[#252525] text-white px-6 mt-2 py-3 text-lg font-medium">
            Download
          </button>
          <Image
            className="mx-auto mt-10"
            src={"/images/ios-download.png"}
            width={240}
            height={263}
            alt="Picture of the author"
          />
        </div>
        <div className="bg-[#F5F5F5] mt-6 md:mt-0 text-center px-6 pt-6 w-full">
          <h2 className="text-2xl font-bold">Android</h2>
          <button className="bg-[#252525] text-white px-6 mt-2 py-3 text-lg font-medium">
            Download
          </button>
          <Image
            className="mx-auto mt-10"
            src={"/images/ios-download.png"}
            width={240}
            height={263}
            alt="Picture of the author"
          />
        </div>
      </div>
    </div>
  );
};

export default Downlaod;
