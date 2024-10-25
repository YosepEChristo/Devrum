"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/elements/navbar/navBar";
import {
  getOrganizations,
  getProjectsByOrganizationId,
} from "@/lib/organizationDB";

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
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);
  const router = useRouter();

  // Fetch organizations when component mounts
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await getOrganizations();
        setOrganizations(orgs);
      } catch (err) {
        console.error("Failed to fetch organizations:", err);
      }
    };
    fetchOrganizations();
  }, []);

  // Fetch projects when an organization is selected
  const handleSelectOrganization = async (orgId: string) => {
    setSelectedOrgId(orgId);
    setLoadingProjects(true);
    try {
      const orgProjects = await getProjectsByOrganizationId(orgId);
      setProjects(orgProjects);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Navigate to project page
  const handleProjectClick = (projectId: string) => {
    try {
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error("navigation failed:", error);
    }
  };

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
          </div>

          {/* Display organizations */}
          <div className="mt-4 flex space-x-4">
            {organizations.map((org) => (
              <button
                key={org.id}
                className={`${
                  selectedOrgId === org.id
                    ? "bg-purple_s text-white"
                    : "bg-white text-purple_s border border-purple_s"
                } font-semibold px-5 py-2 rounded-lg w-[170px] h-[50px]`}
                onClick={() => handleSelectOrganization(org.id)}
              >
                {org.name}
              </button>
            ))}
          </div>
        </div>

        {/* Project Section */}
        <div className="bg-white shadow-lg rounded-lg text-left w-[1300px] h-auto p-6">
          <h2 className="text-[30px] text-grey_s font-semibold">
            Your Project
          </h2>
          <p className="text-[25px] text-grey_s">Select your Project:</p>

          {loadingProjects ? (
            <p>Loading projects...</p>
          ) : (
            <div className="mt-4 flex space-x-4">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <button
                    key={project.id}
                    className="bg-white font-semibold text-grey_s px-6 py-3 rounded-lg shadow-lg"
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
