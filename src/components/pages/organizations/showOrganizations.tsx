// src/components/pages/organizations/ShowOrganizations.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProjectContext } from "../../../context/ProjectContext";
import Navbar from "../elements/navbar/NavBar";
import {
  getOrganizations,
  getProjectsByOrganizationId,
} from "../../../lib/organizationDB";

interface Organization {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}

export function ShowOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null); // Track selected organization
  const { setSelectedProjectId } = useProjectContext();
  const router = useRouter();

  // Fetch organizations on component mount
  useEffect(() => {
    const fetchOrganizations = async () => {
      const orgs = await getOrganizations();
      setOrganizations(orgs);
    };
    fetchOrganizations();
  }, []);

  // Handle organization selection and fetch projects
  const handleSelectOrganization = async (orgId: string) => {
    setSelectedOrgId(orgId); // Set selected organization ID
    setLoadingProjects(true);
    const orgProjects = await getProjectsByOrganizationId(orgId);
    setProjects(orgProjects);
    setLoadingProjects(false);
  };

  // Handle project selection
  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId); // Set selected project globally
    router.push(`/projects/${projectId}`); // Navigate to project page
  };

  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex-1 px-[25px] py-[18px]">
        <div className="bg-white shadow-lg rounded-lg text-left w-[1300px] h-auto p-6 mb-8">
          <h2 className="text-[30px] font-semibold text-gray-600">
            Your Organization
          </h2>
          <p className="text-[25px] text-gray-600">Select your Organization:</p>
          <div className="mt-4 flex space-x-4">
            {organizations.map((org) => (
              <button
                key={org.id}
                className={`font-semibold px-5 py-2 rounded-lg w-[170px] h-[50px] border ${
                  selectedOrgId === org.id
                    ? "bg-purple_s text-white"
                    : "bg-white hover:text-purple_s text-grey_s border-grey_s hover:border-purple_s"
                }`}
                onClick={() => handleSelectOrganization(org.id)}
              >
                {org.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg text-left w-[1300px] h-auto p-6">
          <h2 className="text-[30px] font-semibold text-gray-600">
            Your Project
          </h2>
          <p className="text-[25px] text-gray-600">Select your Project:</p>

          {loadingProjects ? (
            <p>Loading projects...</p>
          ) : (
            <div className="mt-4 flex space-x-4">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <button
                    key={project.id}
                    className="font-semibold border border-grey_s px-5 py-2 rounded-lg text-grey_s hover:border-purple_s hover:bg-purple_s hover:text-white"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    {project.name}
                  </button>
                ))
              ) : (
                <p>No projects available for this organization.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowOrganizations;
