"use client";

import { useState, useEffect } from "react";
import Navbar from "../elements/navbar/NavBar";
import { useProjectContext } from "../../../context/ProjectContext";
import {
  fetchProjectAndDevelopers,
  Developer,
} from "@/service/workItemService";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

export function ShowProject() {
  const [developerData, setDeveloperData] = useState<Developer[]>([]);
  const [projectName, setProjectName] = useState<string>("Unknown");
  const [error, setError] = useState<string | null>(null);
  const { organizationName, selectedProjectId } = useProjectContext();

  const [defectData, setDefectData] = useState<
    { severity: string; count: number }[]
  >([]);
  const [burndownData, setBurndownData] = useState<
    { sprint: string; count: number }[]
  >([]);

  useEffect(() => {
    const loadProjectData = async () => {
      if (!selectedProjectId || !organizationName) {
        setError("Organization name or Project ID is missing.");
        return;
      }

      try {
        const { projectName, developers } = await fetchProjectAndDevelopers(
          organizationName,
          selectedProjectId
        );
        setProjectName(projectName);
        setDeveloperData(developers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      }
    };

    loadProjectData();
  }, [selectedProjectId, organizationName]);

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 px-[25px] py-[18px]">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error:</strong> {error}
          </div>
        )}
        <div className="flex flex-col">
          {/* Project Header */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-[30px] font-semibold text-gray-600">
              Project: {projectName}
            </h2>
            <h2 className="text-[30px] font-semibold text-gray-600">
              Organization: {organizationName}
            </h2>
            <h2 className="text-[30px] font-semibold text-gray-600">
              Project ID: {selectedProjectId}
            </h2>
          </div>

          {/* Charts Row */}
          <div className="flex space-x-4 mb-8">
            {/* Defect Chart */}
            <div className="bg-white shadow-lg rounded-lg p-6 w-1/2">
              <h2 className="text-xl font-bold text-gray-700">
                Defect Severity Chart
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={defectData}>
                  <XAxis dataKey="severity" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FF5733" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Burndown Chart */}
            <div className="bg-white shadow-lg rounded-lg p-6 w-1/2">
              <h2 className="text-xl font-bold text-gray-700">
                Burndown Chart
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={burndownData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sprint" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Developer Table */}
          <div className="bg-white shadow-lg rounded-lg text-left w-[1300px] h-auto p-6 mb-8">
            <h1 className="text-2xl font-bold mb-4 text-grey_s">
              Developers in this Project
            </h1>
            <table className="min-w-full border-collapse border border-grey-700">
              <thead>
                <tr className="bg-purple_s">
                  <th className="border px-4 py-2 text-center">Name</th>
                  <th className="border px-4 py-2 text-center">
                    Developer Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {developerData.length > 0 ? (
                  developerData.map((dev, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-100 cursor-pointer"
                    >
                      <td className="border px-4 py-2 text-grey_s text-center">
                        {dev.name}
                      </td>
                      <td className="border px-4 py-2 text-grey_s text-center">
                        {dev.score}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="border px-4 py-2 text-center">
                      No developers found for this project.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowProject;
