import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="flex gap-2 text-[#252525] bottom-0 pb-4 mt-auto text-sm justify-center mx-auto">
      <Link href="/">© Hasher </Link>
      <Link href="/policy">Policy </Link>
      <Link href="/terms">Terms </Link>
    </div>
  );
};

export default Footer;
