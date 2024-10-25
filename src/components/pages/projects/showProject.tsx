"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/elements/navbar/navBar";
import { useParams } from "next/navigation"; // to get the project ID from URL
import { getDevelopersByProjectId } from "@/lib/organizationDB"; // Import the function to fetch developers

// Example developer data structure
interface Developer {
  name: string;
  userStory: number;
  unfinished: number;
  bugs: number;
  done: number;
  velocity: number;
}

export function ShowProject() {
  const [developerData, setDeveloperData] = useState<Developer[]>([]);
  const { projectId } = useParams(); // get project ID from URL

  // Fetch developers based on project ID
  useEffect(() => {
    const fetchDevelopers = async () => {
      // Ensure projectId is a string
      const id = Array.isArray(projectId) ? projectId[0] : projectId;
      const developers = await getDevelopersByProjectId(id);
      setDeveloperData(developers);
    };

    fetchDevelopers();
  }, [projectId]);

  return (
    <div className="flex h-screen">
      <NavBar />
      <div className="flex-1 px-[25px] py-[18px]">
        <div className="bg-white shadow-lg rounded-lg text-left w-[1300px] h-auto p-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-4">
              Developers in Project {projectId}
            </h1>
          </div>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">User Story</th>
                <th className="border border-gray-300 px-4 py-2">Unfinished</th>
                <th className="border border-gray-300 px-4 py-2">Bugs</th>
                <th className="border border-gray-300 px-4 py-2">Done</th>
                <th className="border border-gray-300 px-4 py-2">Velocity</th>
              </tr>
            </thead>
            <tbody>
              {developerData.length > 0 ? (
                developerData.map((dev, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">
                      {dev.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {dev.userStory}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {dev.unfinished}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {dev.bugs}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {dev.done}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {dev.velocity}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    No developers found for this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ShowProject;
