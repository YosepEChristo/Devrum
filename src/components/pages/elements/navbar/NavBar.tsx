"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import { useProjectContext } from "../../../../context/ProjectContext";

const Navbar: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedProjectId, selectedDeveloper } = useProjectContext();

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
      link: selectedProjectId ? `/projects/${selectedProjectId}` : "#",
      isDisabled: !selectedProjectId,
    },
    {
      id: 2,
      text: "Developer",
      defaultImg: "/assets/navbar/developer_grey.png",
      activeImg: "/assets/navbar/developer.png",
      link: selectedDeveloper ? `/developer` : "#",
      isDisabled: !selectedDeveloper,
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/auth"); // Redirect ke halaman login
    } catch (error) {
      console.error("Failed to logout:", error);
    }
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
        <Link href={option.isDisabled ? "#" : option.link} key={option.id}>
          <button
            className={`flex w-full items-center ${
              option.isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Image
              width={25}
              height={25}
              src={
                pathname?.startsWith(option.link)
                  ? option.activeImg
                  : option.defaultImg
              }
              alt={option.text}
              className="my-4 ml-4"
            />
            <span
              className={`text-[20px] font-medium ml-2 my-4 ${
                pathname?.startsWith(option.link)
                  ? "text-purple-600"
                  : "text-gray-600"
              }`}
            >
              {option.text}
            </span>
          </button>
        </Link>
      ))}

      <button
        onClick={handleLogout}
        className="mt-auto mb-4 mx-4 px-4 py-2 bg-red-600 text-gray-700 font-semibold rounded-lg hover:bg-red-500"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
