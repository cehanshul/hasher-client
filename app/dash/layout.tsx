"use client";
import React, { ReactNode, useState } from "react";
import MenuItems from "./MenuItems";

const DashboardLayout: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<ReactNode | null>(null);

  const handlePageChange = (page: ReactNode) => {
    setSelectedPage(page);
  };

  return (
    <div className="md:flex flex-grow w-full px-5 md:px-0">
      <MenuItems onPageChange={handlePageChange} />
      <div className="w-px sidebar bg-[#e5e7eb] mx-10 md:block mb-1 min-w-[1px] !h-auto fle"></div>x !mx-[0]
      {selectedPage || (
        <div>
          {/* Render default content or a message */}
          <div>Please select an item from the menu.</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
