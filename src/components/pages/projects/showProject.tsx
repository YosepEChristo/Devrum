"use client";

import { useState, useEffect } from "react";
import Navbar from "../elements/navbar/NavBar";
import { useProjectContext } from "../../../context/ProjectContext";
import axios, { AxiosError } from "axios";
import { getAccessTokenFromCookie } from "../../../utils/refreshTokenHandler";

interface Team {
  id: string;
  name: string;
}

export function ShowProject() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { organizationName, selectedProjectId } = useProjectContext();

  useEffect(() => {
    if (!selectedProjectId || !organizationName) {
      setError("Organization name or Project ID is missing.");
      return;
    }

    const fetchProjectDetails = async () => {
      setError(null); // Reset error state before attempting to fetch

      try {
        const accessToken = getAccessTokenFromCookie();
        console.log("Access Token from Cookie:", accessToken);
        console.log("Organization Name:", organizationName);
        console.log("Selected Project ID:", selectedProjectId);

        if (!accessToken) {
          setError("Access token is not available. Please log in again.");
          return;
        }

        // Fetch project details
        const projectResponse = await axios.get(
          `https://dev.azure.com/${organizationName}/_apis/projects/${selectedProjectId}?api-version=6.0`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const projectData = projectResponse.data;
        setProjectName(projectData.name);

        // Fetch team details
        const teamResponse = await axios.get(
          `https://dev.azure.com/${organizationName}/_apis/projects/${selectedProjectId}/teams?api-version=6.0`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setTeams(teamResponse.data.value);
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error("Error fetching project or team details:", axiosError);

        if (axiosError.response?.data) {
          setError(
            `Failed to fetch project or team details: ${
              axiosError.response.data as string
            }`
          );
        } else {
          setError(axiosError.message);
        }
      }
    };

    fetchProjectDetails();
  }, [selectedProjectId, organizationName]);

  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex-1 px-[25px] py-[18px]">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>{" "}
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="flex flex-col">
          {/* Project Header */}
          <div className="bg-white shadow-lg rounded-lg text-left w-[1300px] h-auto p-6 mb-8">
            <h2 className="text-[30px] font-semibold text-gray-600">
              Project: {projectName || selectedProjectId}
            </h2>

            <h2 className="text-[30px] font-semibold text-gray-600">
              Organization: {organizationName}
            </h2>

            <h2 className="text-[30px] font-semibold text-gray-600">
              Project ID: {selectedProjectId}
            </h2>
          </div>

          {/* Teams Card */}
          <div className="bg-white shadow-lg rounded-lg text-left w-[1300px] h-auto p-6 mb-8">
            <h2 className="text-[30px] font-semibold text-gray-600">
              Teams in this Project:
            </h2>
            {teams.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-gray-50"
                  >
                    <h3 className="text-[20px] font-semibold text-gray-800">
                      {team.name}
                    </h3>
                    <p className="text-[14px] text-gray-600">
                      Team ID: {team.id}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No teams available for this project.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowProject;
