"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Developer {
  name: string;
  storyPoints: number;
  velocity: number; // ✅ Tambahkan properti ini
  score: number;
  bugFixScore: number;
}

export interface DpsWeights {
  effort: number;
  velocity: number;
  bugFix: number;
}

interface ProjectContextProps {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  organizationName: string | null;
  setOrganizationName: (name: string | null) => void;
  selectedDeveloper: Developer | null;
  setSelectedDeveloper: (developer: Developer | null) => void;
  dpsWeights: DpsWeights;
  updateDpsWeights: (weights: DpsWeights) => void;
  developerScores: Record<string, number>;
  setDeveloperScores: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
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
  const [developerScores, setDeveloperScores] = useState<
    Record<string, number>
  >({});
  const [dpsWeights, setDpsWeights] = useState<DpsWeights>({
    effort: 100,
    velocity: 0,
    bugFix: 0,
  });
  const updateDpsWeights = (newWeights: DpsWeights) => {
    setDpsWeights(newWeights);
    localStorage.setItem("dpsWeights", JSON.stringify(newWeights)); // Simpan ke localStorage
  };

  return (
    <ProjectContext.Provider
      value={{
        selectedProjectId,
        setSelectedProjectId,
        organizationName,
        setOrganizationName,
        selectedDeveloper,
        setSelectedDeveloper,
        dpsWeights,
        updateDpsWeights,
        developerScores,
        setDeveloperScores,
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
