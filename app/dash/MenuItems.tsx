import Image from "next/image";
import React from "react";
import AccountPage from "../account/page";
import ExpertSettingsPage from "../expert/page";

interface MenuItem {
  label: string;
  icon: string;
  component: React.ReactNode;
}

const settingsItems: MenuItem[] = [
  {
    label: "Become Expert",
    icon: "/images/icons/calender.svg",
    component: <ExpertSettingsPage />,
  },
  {
    label: "Wallet",
    icon: "/images/icons/calender.svg",
    component: <AccountPage />,
  },
  {
    label: "Calender",
    icon: "/images/icons/calender.svg",
    component: <AccountPage />,
  },
  {
    label: "Blocked Dates",
    icon: "/images/icons/calender.svg",
    component: <AccountPage />,
  },
];

const supportItems: MenuItem[] = [
  {
    label: "Contact us",
    icon: "/images/icons/calender.svg",
    component: <AccountPage />,
  },
  {
    label: "Give us feedback",
    icon: "/images/icons/calender.svg",
    component: <AccountPage />,
  },
  {
    label: "Verification",
    icon: "/images/icons/calender.svg",
    component: <AccountPage />,
  },
];

const legalItems: MenuItem[] = [
  {
    label: "Terms of Service",
    icon: "/images/icons/calender.svg",
    component: <AccountPage />,
  },
  {
    label: "Privacy Policy",
    icon: "/images/icons/calender.svg",
    component: <AccountPage />,
  },
];

interface MenuItemsProps {
  onPageChange: (page: React.ReactNode) => void;
}

const MenuItems: React.FC<MenuItemsProps> = ({ onPageChange }) => {
  const handleItemClick = (page: React.ReactNode) => {
    onPageChange(page);
  };

  return (
    <div className="relative pt-[20px] w-full mt-10 md:pt-0 md:max-w-[300px]  md:pr-[40px]">
      <ProfileSection />
      <Section
        title="Settings"
        items={settingsItems}
        onItemClick={handleItemClick}
      />
      <Section
        title="Support"
        items={supportItems}
        onItemClick={handleItemClick}
      />
      <Section title="Legal" items={legalItems} onItemClick={handleItemClick} />
      <AccountSection />
    </div>
  );
};

const ProfileSection: React.FC = () => (
  <>
    <div className="w-full flex flex-col md:hidden">
      <Image
        src=""
        className="w-full rounded-full"
        width={100}
        height={100}
        alt="Anshul Sharma"
      />
      <div className="flex flex-col mt-[15px] cursor-pointer">
        <p className="text-[24px]">Anshul Sharmam Bhardwaj</p>
        <p className="text-[16px] text-[#4A4A4A] ml-[3px]">Joined in 2024</p>
      </div>
    </div>
    <div className="w-full cursor-pointer hidden md:flex">
      <Image
        src="https://res.cloudinary.com/dfrhou0si/image/upload/v1715754228/hasher_profile_picture/image_cropper_7B039180-DC68-413E-9F83-ECECC4E39F97-4731-000005F15849C44D_omywcc.jpg"
        width={200}
        height={200}
        className="rounded-full w-20 h-20"
        alt="Anshul Sharma"
      />
      <div className="flex flex-col justify-center p-4">
        <p className="text-[18px] truncate max-w-[150px]">Anshul Sharma</p>
        <p className="text-[16px] text-[#4A4A4A] ml-[3px] truncate max-w-[150px]">
          Cyber Security
        </p>
      </div>
    </div>
  </>
);

interface SectionProps {
  title: string;
  items: MenuItem[];
  onItemClick: (page: React.ReactNode) => void;
}

const Section: React.FC<SectionProps> = ({ title, items, onItemClick }) => (
  <>
    <p className="mt-8 mb-4 text-off-black font-medium text-[19px] md:text-17">
      {title}
    </p>
    <ul className="select-none">
      {items.map((item, index) => (
        <li key={index}>
          <button
            className="relative p-2 my-2 text-off-black block rounded-lg hover:bg-[#f9f9fb] cursor-pointer border border-transparent text-17 w-full text-left"
            onClick={() => onItemClick(item.component)}
          >
            {item.label}
            <Image
              className="absolute right-4 top-2/4 transform -translate-y-2/4"
              alt="Arrow"
              width={8}
              height={16}
              src={item.icon}
            />
          </button>
        </li>
      ))}
    </ul>
  </>
);

const AccountSection: React.FC = () => (
  <>
    <p className="mt-8 mb-4 text-off-black font-medium text-[19px] md:text-17">
      Account
    </p>
    <ul className="select-none">
      <li>
        <button className="relative p-4 my-2 text-off-black block rounded-lg hover:bg-[#f9f9fb] cursor-pointer border border-transparent text-17 w-full text-left">
          Log out
          <Image
            className="absolute right-4 top-2/4 transform -translate-y-2/4"
            alt="Arrow"
            width={8}
            height={16}
            src="/images/icons/calender.svg"
          />
        </button>
      </li>
    </ul>
    <p className="mt-8 mb-4 text-off-black font-medium text-[19px] md:text-17">
      Deactivate
    </p>
    <ul className="mb-[30px] md:mb-0 select-none">
      <li>
        <button className="relative p-4 my-2 text-off-black block rounded-lg hover:bg-[#f9f9fb] cursor-pointer border border-transparent text-17 w-full text-left">
          Delete account
          <Image
            className="absolute right-4 top-2/4 transform -translate-y-2/4"
            alt="Arrow"
            width={8}
            height={16}
            src="/images/icons/calender.svg"
          />
        </button>
      </li>
    </ul>
    <p className="mt-8 mb-4 text-off-black font-light text-lg">
      Chill, we&apos;re not your ex - we won&apos;t spill your secrets or sell
      your data!
    </p>
  </>
);

export default MenuItems;
