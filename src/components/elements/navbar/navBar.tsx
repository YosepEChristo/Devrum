
import { useState } from 'react';

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
    },
    {
      id: 1,
      text: "Dashboard",
      defaultImg: "/assets/navbar/dashboard_grey.png",
      activeImg: "/assets/navbar/dashboard.png",
    },
    {
      id: 2,
      text: "Developer",
      defaultImg: "/assets/navbar/developer_grey.png",
      activeImg: "/assets/navbar/developer.png",
    },
  ];
  return (
    <div className="flex flex-col w-[220px] h-screen bg-white shadow-lg">
      <nav className="flex flex-col items-center justify-center h-[100px]">
        {navOptions.map((option, index) => (
        <button
          key={option.id}
          className={`flex flex-col items-center focus:outline-none ${
            activeIndex === index ? 'text-green-500' : 'text-gray-500'
          }`}
          onClick={() => handleClick(index)}
        >
          <img
            src={activeIndex === index ? option.activeImg : option.defaultImg}
            alt={option.text}
            className="h-8 w-8 mb-2"
          />
          <span>{option.text}</span>
        </button>
      ))}
    </nav>
    </div>
  );
}

export default Navbar;
