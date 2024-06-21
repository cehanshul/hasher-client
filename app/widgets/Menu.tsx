import Image from "next/image";
import Link from "next/link";
import React from "react";

const Menu = () => {
  return (
    <div className="NavBar hidden  z-[60] md:flex md:flex-col md:items-center bg-[#f9f9fb] md:border-r border-t md:border-t-0 border-[#e3e3e3] pt-[13px] pb-[13px] px-[22px] md:pt-[30px] md:pb-[30px] md:px-[12px]  md:relative fixed left-0 right-0 bottom-[-1px] md:bottom-0">
      <Link
        className=" mx-0 ml-0 py-0 pr-0 md:block hidden"
        href="https://intro.co/"
      >
        <Image
          alt="Hasher Logo"
          height={40}
          width={60}
          src="/images/logo-s.png"
        />
      </Link>
      <div className="md:flex-col flex md:items-center md:justify-start justify-between md:mt-[50px] md:max-w-none max-w-[320px] mx-[35px] md:mx-auto">
        <div className="md:block inline relative NavItem active">
          <Link
            href="/marketplace"
            className="flex items-center justify-center"
          >
            <Image
              alt="Marketplace"
              height={40}
              width={40}
              src="/images/logo-s.png"
              className="w-[30px] h-[30px] md:w-[26px] md:h-[26px]"
            />
          </Link>
        </div>
        <div className="md:block inline relative md:mt-[26px] NavItem">
          <Link href="/account" className="flex items-center justify-center">
            <Image
              height={40}
              width={40}
              alt="Account"
              src="/images/logo-s.png"
              className="w-[23px] h-[30px] md:w-[19px] md:h-[26px]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Menu;
