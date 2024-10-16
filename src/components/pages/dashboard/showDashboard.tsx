"use client";

import NavBar from "@/components/elements/navbar/navBar";
export function ShowDashboard() {
  return (
    <div className="flex h-screen">
      <NavBar />
      <div className="flex-1 px-[25px] py-[18px]">
        <div className="bg-white shadow-lg rounded-lg  text-center w-[1300px] h-[300px]"></div>
      </div>
    </div>
  );
}

export default ShowDashboard;
