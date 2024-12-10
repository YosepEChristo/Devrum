// src/context/ProjectContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Task {
  taskName: string;
  userStoryCount: number;
  priority: number; // Added priority
  status: "DONE" | "UNFINISHED" | "BUGS";
}

interface SprintData {
  sprintId: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
}

interface Developer {
  name: string;
  sprintData: SprintData[];
}

interface Project {
  id: string;
  name: string;
}

interface ProjectContextType {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  selectedDeveloper: Developer | null;
  setSelectedDeveloper: (developer: Developer | null) => void;
  organizationName: string | null;
  setOrganizationName: (name: string | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(
    null
  );
  const [organizationName, setOrganizationName] = useState<string | null>(null);

  return (
    <ProjectContext.Provider
      value={{
        selectedProjectId,
        setSelectedProjectId,
        selectedProject,
        setSelectedProject,
        selectedDeveloper,
        setSelectedDeveloper,
        organizationName,
        setOrganizationName,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error(
      "useProjectContext must be used within a ProjectContextProvider"
    );
  }
  return context;
};
