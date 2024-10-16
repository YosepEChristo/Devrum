import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const navOptions = [
    {
      id: 0,
      text: "Organization",
      defaultImg: "/assets/navbar/organization_grey.png",
      activeImg: "/assets/navbar/organization.png",
      link: "/organizations",
    },
    {
      id: 1,
      text: "Dashboard",
      defaultImg: "/assets/navbar/dashboard_grey.png",
      activeImg: "/assets/navbar/dashboard.png",
      link: "/dashboard",
    },
    {
      id: 2,
      text: "Developer",
      defaultImg: "/assets/navbar/developer_grey.png",
      activeImg: "/assets/navbar/developer.png",
    },
  ];

  return (
    <nav className="flex flex-col bg-white w-[220px] h-screen pt-3">
      <Image
        src="/assets/devrum.png"
        alt="Devrum Logo"
        width={130}
        height={31}
        className="pl-2 mb-[40px]"
      />
      {navOptions.map((option, index) => (
        <Link href={option.link ?? "/"} key={option.id} passHref>
          <button
            className={`flex ${
              activeIndex === index ? "text-purple_s" : "text-grey_t"
            }`}
            onClick={() => handleClick(index)}
          >
            <Image
              width={25}
              height={25}
              src={activeIndex === index ? option.activeImg : option.defaultImg}
              alt={option.text}
              className="my-4 ml-4"
            />
            <span className="text-[20px] font-medium ml-2 my-4">
              {option.text}
            </span>
          </button>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
