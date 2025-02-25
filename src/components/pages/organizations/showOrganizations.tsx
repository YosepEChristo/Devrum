"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectContext } from "../../../context/ProjectContext";
import Navbar from "../elements/navbar/NavBar";
import axios from "axios";
import { getAccessTokenFromCookie } from "../../../utils/refreshTokenHandler";

interface Project {
  id: string;
  name: string;
}

export function ShowOrganizations() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);
  const { setSelectedProjectId, setOrganizationName, organizationName } =
    useProjectContext();
  const [organizationNameInput, setOrganizationNameInput] = useState<string>(
    organizationName || "" // Load initial value from context
  );
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizationNameInput(event.target.value);
  };

  const fetchProjects = async () => {
    if (!organizationNameInput) {
      alert("Please enter an organization name.");
      return;
    }

    setOrganizationName(organizationNameInput);

    setLoadingProjects(true);
    try {
      const accessToken = getAccessTokenFromCookie();

      if (!accessToken) {
        alert("Access token is not available. Please log in again.");
        setLoadingProjects(false);
        return;
      }

      const response = await axios.get(
        `https://dev.azure.com/${organizationNameInput}/_apis/projects?api-version=6.0`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProjects(response.data.value);
    } catch (error) {
      console.error("Error fetching projects:", error);
      alert("Failed to fetch projects. Please check the organization name.");
    }
    setLoadingProjects(false);
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    router.push(`/projects/${projectId}`);
  };

  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex-1 px-[25px] py-[18px]">
        <div className="bg-white shadow-lg rounded-lg text-left w-[1300px] h-auto p-6 mb-8">
          <h2 className="text-[30px] font-semibold text-purple_s">
            Your Organization
          </h2>
          <p className="text-[25px] text-gray-600">Write your Organization:</p>
          <div className="mt-4 flex items-center space-x-4">
            <input
              type="text"
              value={organizationNameInput}
              onChange={handleInputChange}
              placeholder="Enter organization name"
              className="font-semibold text-grey_s px-5 py-2 rounded-lg w-[400px] h-[50px] border border-grey_s"
            />
            <button
              className="font-semibold px-5 py-2 rounded-lg w-[170px] h-[50px] bg-purple_s text-white hover:bg-purple-700"
              onClick={fetchProjects}
            >
              Fetch Projects
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg text-left w-[1300px] h-auto p-6">
          <h2 className="text-[30px] font-semibold text-purple_s">
            Your Project
          </h2>
          {loadingProjects ? (
            <p>Loading projects...</p>
          ) : (
            <div className="mt-4 flex space-x-4">
              {projects.map((project) => (
                <button
                  key={project.id}
                  className="font-semibold border border-grey_s px-5 py-2 rounded-lg text-grey_s hover:border-purple_s hover:bg-purple_s hover:text-white"
                  onClick={() => handleProjectClick(project.id)}
                >
                  {project.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowOrganizations;
