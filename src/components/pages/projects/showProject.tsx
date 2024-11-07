// src/components/pages/projects/ShowProject.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "../elements/navbar/NavBar";
import { useParams, useRouter } from "next/navigation";
import { getDevelopersByProjectId } from "../../../lib/organizationDB";
import { useProjectContext } from "../../../context/ProjectContext";
// Import Chart.js components
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface Task {
  taskName: string;
  userStoryCount: number;
  priority: number;
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
  sprintData: SprintData[]; // Array of sprint-specific data for each developer
}

export function ShowProject() {
  const [developerData, setDeveloperData] = useState<Developer[]>([]);
  const { projectId } = useParams();
  const router = useRouter();
  const { setSelectedProjectId, setSelectedDeveloper } = useProjectContext();

  const resolvedProjectId = typeof projectId === "string" ? projectId : null;

  useEffect(() => {
    if (resolvedProjectId) {
      setSelectedProjectId(resolvedProjectId);
    }
  }, [resolvedProjectId, setSelectedProjectId]);

  useEffect(() => {
    const fetchDevelopers = async () => {
      if (resolvedProjectId) {
        const developers = await getDevelopersByProjectId(resolvedProjectId);
        setDeveloperData(developers);
      }
    };
    fetchDevelopers();
  }, [resolvedProjectId]);

  if (!resolvedProjectId) {
    router.push("/organizations");
    return null;
  }

  const handleDeveloperClick = (developer: Developer) => {
    setSelectedDeveloper(developer); // Set the selected developer in context
    router.push("/developer"); // Navigate to developer page
  };

  // Function to calculate total metrics based on tasks for each developer
  const calculateTotals = (sprints: SprintData[]) => {
    let totalDone = 0;
    let totalUnfinished = 0;
    let totalBugs = 0;
    let totalUserStories = 0;

    sprints.forEach((sprint) => {
      sprint.tasks.forEach((task) => {
        totalUserStories += task.userStoryCount;

        switch (task.status) {
          case "DONE":
            totalDone += task.userStoryCount;
            break;
          case "UNFINISHED":
            totalUnfinished += task.userStoryCount;
            break;
          case "BUGS":
            totalBugs += task.userStoryCount;
            break;
        }
      });
    });

    const velocity = (totalDone + totalBugs) / sprints.length;

    return {
      totalDone,
      totalUnfinished,
      totalBugs,
      totalUserStories,
      velocity,
    };
  };

  // Prepare data for Defect Bar Chart (Total bugs per sprint)
  const defectData = {
    labels:
      developerData[0]?.sprintData.map(
        (sprint) => `Sprint ${sprint.sprintId}`
      ) || [],
    datasets: [
      {
        label: "Total Bugs Created",
        data:
          developerData[0]?.sprintData.map((sprint, index) =>
            developerData.reduce(
              (total, dev) =>
                total +
                dev.sprintData[index]?.tasks.reduce(
                  (bugCount, task) =>
                    bugCount +
                    (task.status === "BUGS" ? task.userStoryCount : 0),
                  0
                ),
              0
            )
          ) || [],
        backgroundColor: "rgba(162, 210, 255, 1)",
      },
    ],
  };

  // Prepare data for Burndown Line Chart (Total unfinished stories per sprint)
  const burndownData = {
    labels:
      developerData[0]?.sprintData.map(
        (sprint) => `Sprint ${sprint.sprintId}`
      ) || [],
    datasets: [
      {
        label: "Total Unfinished User Stories",
        data:
          developerData[0]?.sprintData.map((sprint, index) =>
            developerData.reduce(
              (total, dev) =>
                total +
                dev.sprintData[index]?.tasks.reduce(
                  (unfinishedCount, task) =>
                    unfinishedCount +
                    (task.status === "UNFINISHED" ? task.userStoryCount : 0),
                  0
                ),
              0
            )
          ) || [],
        borderColor: "rgba(140, 82, 255, 1)",
        backgroundColor: "rgba(140, 82, 255, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex-1 px-[25px] py-[18px]">
        <div className="flex flex-col">
          {/* Charts Section */}
          <div className="flex space-x-8 mb-8">
            {/* Defect Bar Chart */}
            <div className="w-1/2 bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-[24px] text-grey_s font-semibold mb-4 text-center">
                Defect Bar Chart
              </h2>
              <Bar
                data={defectData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </div>
            {/* Burndown Line Chart */}
            <div className="w-1/2 bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-[24px] text-grey_s font-semibold mb-4 text-center">
                Burndown Line Chart
              </h2>
              <Line
                data={burndownData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </div>
          </div>

          {/* Developer Table */}
          <div className="bg-white shadow-lg rounded-lg text-left w-[1300px] h-auto p-6 mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold mb-4 text-grey_s">
                Developers in Project {resolvedProjectId}
              </h1>
            </div>
            <table className="min-w-full border-collapse border border-white">
              <thead>
                <tr className="bg-white">
                  <th className="border border-white text-grey_s px-4 py-2">
                    Name
                  </th>
                  <th className="border border-white text-grey_s px-4 py-2">
                    Completed User Stories
                  </th>
                  <th className="border border-white text-grey_s px-4 py-2">
                    Unfinished User Stories
                  </th>
                  <th className="border border-white text-grey_s px-4 py-2">
                    Bugs Created
                  </th>
                  <th className="border border-white text-grey_s px-4 py-2">
                    Velocity
                  </th>
                  <th className="border border-white text-grey_s px-4 py-2">
                    Total User Stories
                  </th>
                </tr>
              </thead>
              <tbody>
                {developerData.length > 0 ? (
                  developerData.map((dev, index) => {
                    const totals = calculateTotals(dev.sprintData);

                    return (
                      <tr key={index}>
                        <td
                          className="border border-white px-4 py-2 text-grey_s hover:text-purple_s cursor-pointer"
                          onClick={() => handleDeveloperClick(dev)}
                        >
                          {dev.name}
                        </td>
                        <td className="border border-white text-grey_s px-4 py-2">
                          {totals.totalDone}
                        </td>
                        <td className="border border-white text-grey_s px-4 py-2">
                          {totals.totalUnfinished}
                        </td>
                        <td className="border border-white text-grey_s px-4 py-2">
                          {totals.totalBugs}
                        </td>
                        <td className="border border-white text-grey_s px-4 py-2">
                          {totals.velocity.toFixed(2)}
                        </td>
                        <td className="border border-white text-grey_s px-4 py-2">
                          {totals.totalUserStories}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="border border-gray-300 px-4 py-2 text-center"
                    >
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
