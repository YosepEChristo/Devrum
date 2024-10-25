// app/components/elements/navbar/Navbar.tsx
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

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
      text: "Projects",
      defaultImg: "/assets/navbar/dashboard_grey.png",
      activeImg: "/assets/navbar/dashboard.png",
      link: "/projects",
    },
    {
      id: 2,
      text: "Developer",
      defaultImg: "/assets/navbar/developer_grey.png",
      activeImg: "/assets/navbar/developer.png",
      link: "/developer",
    },
  ];

  const isActive = (link: string) => {
    return pathname === link;
  };

  return (
    <nav className="flex flex-col bg-white w-[220px] h-screen pt-3">
      <Image
        src="/assets/devrum.png"
        alt="Devrum Logo"
        width={130}
        height={31}
        className="pl-2 mb-[40px]"
      />
      {navOptions.map((option) => (
        <Link href={option.link} key={option.id} passHref>
          <button className="flex w-full">
            <Image
              width={25}
              height={25}
              src={isActive(option.link) ? option.activeImg : option.defaultImg}
              alt={option.text}
              className="my-4 ml-4"
            />
            <span
              className={`text-[20px] font-medium ml-2 my-4 ${
                isActive(option.link) ? "text-purple_s" : "text-grey_s"
              }`}
            >
              {option.text}
            </span>
          </button>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
