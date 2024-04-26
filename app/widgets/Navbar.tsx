"use client";

import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="w-full max-w-6xl py-4 px-4 md:py-6 mx-auto bg-white">
      <Link href={"/"} className="text-2xl ">
        #Hasher
      </Link>
    </div>
  );
};

export default Navbar;
