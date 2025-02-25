"use client";

import { useState, useEffect } from "react";
import Navbar from "../elements/navbar/NavBar";
import { useProjectContext } from "../../../context/ProjectContext";
import {
  fetchProjectAndDevelopers,
  Developer,
  fetchUserStoriesForDeveloper,
  UserStory,
} from "@/service/workItemService";
import { useRouter } from "next/navigation";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

// Registrasi elemen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export function ShowProject() {
  const [developerData, setDeveloperData] = useState<Developer[]>([]);
  const [projectName, setProjectName] = useState<string>("Unknown");
  const [error, setError] = useState<string | null>(null);
  const { organizationName, selectedProjectId, setSelectedDeveloper } =
    useProjectContext();
  const router = useRouter();

  const [sprintNames, setSprintNames] = useState<string[]>([]);
  const [bugCounts, setBugCounts] = useState<number[]>([]);
  const [burndownData, setBurndownData] = useState<number[]>([]);

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

        // Fetch User Stories dan Bugs untuk Burndown dan Defect Chart
        const allStories: UserStory[] = [];
        for (const dev of developers) {
          const stories = await fetchUserStoriesForDeveloper(
            organizationName,
            selectedProjectId,
            dev.name
          );
          allStories.push(...stories);
        }

        processChartData(allStories);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      }
    };

    loadProjectData();
  }, [selectedProjectId, organizationName]);

  // Proses data untuk chart
  const processChartData = (stories: UserStory[]) => {
    const sprintMap: Record<string, { bugs: number; totalWorkItems: number }> =
      {};

    stories.forEach((story) => {
      if (!sprintMap[story.sprint]) {
        sprintMap[story.sprint] = { bugs: 0, totalWorkItems: 0 };
      }

      // Hanya work items yang statusnya bukan "Done" yang dihitung
      if (story.status.toLowerCase() !== "done") {
        sprintMap[story.sprint].totalWorkItems += 1;
      }

      // Hitung jumlah bug di sprint tersebut
      if (story.type.toLowerCase() === "bug") {
        sprintMap[story.sprint].bugs += 1;
      }
    });

    const sprints = Object.keys(sprintMap).sort();
    const bugCounts = sprints.map((sprint) => sprintMap[sprint].bugs);
    const burndownData = sprints.map(
      (sprint) => sprintMap[sprint].totalWorkItems
    );

    setSprintNames(sprints);
    setBugCounts(bugCounts);
    setBurndownData(burndownData);
  };

  // Konfigurasi data untuk Defect Bar Chart
  const defectChartData = {
    labels: sprintNames,
    datasets: [
      {
        label: "Defects Found",
        data: bugCounts,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Konfigurasi data untuk Burndown Chart
  const burndownChartData = {
    labels: sprintNames,
    datasets: [
      {
        label: "Remaining Work Items",
        data: burndownData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
    ],
  };

  const handleDeveloperClick = (developer: Developer) => {
    setSelectedDeveloper(developer);
    router.push("/developer");
  };

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

          {/* Chart Section */}
          <div className="flex space-x-4 mb-8">
            <div className="bg-white shadow-lg rounded-lg p-6 flex-1">
              <h2 className="text-lg font-semibold text-gray-600 mb-4">
                Defect Bar Chart
              </h2>
              <Bar data={defectChartData} />
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 flex-1">
              <h2 className="text-lg font-semibold text-gray-600 mb-4">
                Burndown Chart
              </h2>
              <Line data={burndownChartData} />
            </div>
          </div>

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
                      onClick={() => handleDeveloperClick(dev)}
                      className="hover:bg-gray-100 cursor-pointer"
                    >
                      <td className="border px-4 py-2 text-grey_s text-center">
                        {dev.name}
                      </td>
                      <td className="border px-4 py-2 text-grey_s text-center">
                        {dev.score.toFixed(2)}
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
