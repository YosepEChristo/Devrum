"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Developer {
  name: string;
  storyPoints: number;
  velocity: number; // ✅ Tambahkan properti ini
  score: number;
  bugFixScore: number;
}

interface ProjectContextProps {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  organizationName: string | null;
  setOrganizationName: (name: string | null) => void;
  selectedDeveloper: Developer | null;
  setSelectedDeveloper: (developer: Developer | null) => void;
}

const ProjectContext = createContext<ProjectContextProps | undefined>(
  undefined
);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(
    null
  );

  return (
    <ProjectContext.Provider
      value={{
        selectedProjectId,
        setSelectedProjectId,
        organizationName,
        setOrganizationName,
        selectedDeveloper,
        setSelectedDeveloper,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
}

export default ProjectProvider;
