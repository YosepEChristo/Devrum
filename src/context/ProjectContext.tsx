"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Developer {
  name: string;
  storyPoints: number;
  velocity: number;
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
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("selectedProjectId");
      }
      return null;
    }
  );

  const [organizationName, setOrganizationName] = useState<string | null>(
    () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("organizationName");
      }
      return null;
    }
  );

  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(
    null
  );

  const [dpsWeights, setDpsWeights] = useState<DpsWeights>({
    effort: 100,
    velocity: 0,
    bugFix: 0,
  });

  const [developerScores, setDeveloperScores] = useState<
    Record<string, number>
  >({});

  // Simpan ke localStorage saat projectId berubah
  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem("selectedProjectId", selectedProjectId);
    } else {
      localStorage.removeItem("selectedProjectId");
    }
  }, [selectedProjectId]);

  // Simpan ke localStorage saat organizationName berubah
  useEffect(() => {
    if (organizationName) {
      localStorage.setItem("organizationName", organizationName);
    } else {
      localStorage.removeItem("organizationName");
    }
  }, [organizationName]);

  if (!hasMounted) return null;

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
        updateDpsWeights: setDpsWeights,
        developerScores,
        setDeveloperScores,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext(): ProjectContextProps {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
}

export default ProjectProvider;
