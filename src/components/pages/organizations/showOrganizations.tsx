"use client";

import Image from "next/image";
import NavBar from "@/components/elements/navbar/navBar";

export function ShowOrganizations() {
  return (
    <div className="flex h-screen">
      <NavBar />
      <div className="flex-1 px-[25px] py-[18px]">
        <div className="bg-white shadow-lg rounded-lg text-left w-[1300px] h-auto p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-[30px] text-grey_s font-semibold">
                Your Organization
              </h2>
              <p className="text-[25px] text-grey_s">
                Select your Organization:
              </p>
            </div>
            <button className="bg-purple_s text-white font-semibold pl-4 py-2 pr-6 rounded flex items-center h-[50px]">
              <Image
                src="/assets/pages/organizations/azuredevops.png"
                alt="Devrum Logo"
                width={30}
                height={30}
                className="pl-2 mr-2"
              />
              Azure DevOps Board
            </button>
          </div>
          <div className="mt-4 flex space-x-4">
            <button className="bg-purple_s text-white font-semibold px-5 py-2 rounded-lg w-[170px] h-[50px]">
              yosepgg
            </button>
            <button className="bg-white text-purple_s font-semibold border border-purple_s px-6 py-3 rounded-lg w-[170px] h-[50px]">
              yosepgg0248
            </button>
          </div>
        </div>

        {/* Project Section */}
        <div className="bg-white shadow-lg rounded-lg text-left w-[1300px] h-auto p-6">
          <h2 className="text-[30px] text-grey_s font-semibold">
            Your Project
          </h2>
          <p className="text-[25px] text-grey_s">Select your Project:</p>
          <div className="mt-4 flex space-x-4">
            <button className="bg-white font-semibold text-grey_s px-6 py-3 rounded-lg shadow-lg">
              Skripsi
            </button>
            <button className="bg-white font-semibold text-grey_s px-6 py-3 rounded-lg shadow-lg">
              SiMantan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowOrganizations;
