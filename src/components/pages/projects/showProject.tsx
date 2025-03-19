"use client";

import { useState, useEffect } from "react";
import Navbar from "../elements/navbar/NavBar";
import { useProjectContext } from "../../../context/ProjectContext";
import { DpsWeights } from "../../../context/ProjectContext";

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
  const { developerScores, setDeveloperScores } = useProjectContext();
  const [projectName, setProjectName] = useState<string>("Unknown");
  const [error, setError] = useState<string | null>(null);
  const { organizationName, selectedProjectId, setSelectedDeveloper } =
    useProjectContext();
  const router = useRouter();

  const [sprintNames, setSprintNames] = useState<string[]>([]);
  const [bugCounts, setBugCounts] = useState<number[]>([]);
  const [burndownData, setBurndownData] = useState<number[]>([]);

  // State untuk bobot DPS
  const [weightError, setWeightError] = useState<string | null>(null);
  const { dpsWeights, updateDpsWeights } = useProjectContext();
  const [newWeights, setNewWeights] = useState(dpsWeights);

  useEffect(() => {
    setDeveloperData((prev) =>
      prev.map((dev) => ({
        ...dev,
        score: developerScores[dev.name] || dev.score, // Gunakan DPS lama jika ada
      }))
    );
  }, [developerScores]);

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

        processChartData(allStories); // Tetap jalankan pemrosesan chart

        // Gabungkan data developer dengan DPS yang sudah ada
        const updatedDevelopers = developers.map((dev) => ({
          ...dev,
          score: developerScores[dev.name] || dev.score, // Gunakan DPS lama jika ada
        }));

        setDeveloperData(updatedDevelopers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      }
    };

    loadProjectData();
  }, [selectedProjectId, organizationName, developerScores]); // Tambahkan dependency developerScores agar DPS tetap diperbarui

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

  // Hitung nilai maksimum untuk membuat "spare" di bagian atas
  const maxBugs = bugCounts.length > 0 ? Math.max(...bugCounts) : 0;
  const maxBurndown = burndownData.length > 0 ? Math.max(...burndownData) : 0;

  // Konfigurasi chart untuk Defect Bar Chart
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

  const defectChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: maxBugs + 1,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  // Konfigurasi chart untuk Burndown Chart
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

  const burndownChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: maxBurndown + 1,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  const handleDeveloperClick = (developer: Developer) => {
    setSelectedDeveloper(developer);
    router.push("/developer");
  };

  // Handle weight input change
  const handleWeightChange = (field: keyof DpsWeights, value: string) => {
    // Hapus karakter non-angka
    let newValue = value.replace(/\D/g, "");

    // Jika kosong, set 0 agar bisa dihapus
    if (newValue === "") {
      setNewWeights((prev) => ({ ...prev, [field]: 0 }));
      return;
    }

    // Hilangkan angka 0 di depan, kecuali jika hanya "0"
    newValue = newValue.replace(/^0+(?=\d)/, "");

    // Jika lebih dari 3 digit, potong menjadi 3 digit pertama
    if (newValue.length > 3) {
      newValue = newValue.slice(0, 3);
    }

    // Konversi ke angka
    let numValue = Number(newValue);

    // Jika lebih dari 100, ambil hanya 2 digit terakhir
    if (numValue > 100) {
      newValue = newValue.slice(-2);
      numValue = Number(newValue);
    }

    // Perbarui state bobot DPS
    setNewWeights((prev) => ({ ...prev, [field]: numValue }));
  };

  // Handle recalculation of DPS
  const handleRecalculate = () => {
    const totalWeight =
      newWeights.effort + newWeights.velocity + newWeights.bugFix;
    if (totalWeight !== 100) {
      setWeightError("Weights must sum to 100%");
      return;
    }
    updateDpsWeights(newWeights);
    setWeightError(null);

    const newScores: Record<string, number> = {};
    const newDeveloperData = developerData.map((dev) => {
      const newScore =
        (newWeights.effort / 100) * dev.storyPoints +
        (newWeights.velocity / 100) * dev.velocity +
        (newWeights.bugFix / 100) * dev.bugFixScore;

      newScores[dev.name] = newScore; // Simpan skor di state global
      return { ...dev, score: newScore };
    });

    setDeveloperScores((prevScores) => ({ ...prevScores, ...newScores })); // Simpan DPS agar tidak hilang saat berpindah halaman
    setDeveloperData(newDeveloperData);
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
          </div>

          {/* Chart Section */}
          <div className="flex space-x-4 mb-8">
            <div className="bg-white shadow-lg rounded-lg p-6 flex-1">
              <h2 className="text-lg font-semibold text-gray-600 mb-4">
                Defect Bar Chart
              </h2>
              <Bar data={defectChartData} options={defectChartOptions} />
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 flex-1">
              <h2 className="text-lg font-semibold text-gray-600 mb-4">
                Carryover Backlog Chart
              </h2>
              <Line data={burndownChartData} options={burndownChartOptions} />
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg text-left w-[1300px] h-auto p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-grey_s">
                Developers in this Project
              </h1>

              <div className="flex items-center space-x-2">
                {/* Input untuk Story Points */}
                <div className="flex items-center">
                  <div className="bg-green text-white p-2 rounded-l">
                    Story Point
                  </div>
                  <input
                    type="number"
                    value={newWeights.effort}
                    onChange={(e) =>
                      handleWeightChange("effort", e.target.value)
                    }
                    className="border text-grey_s border-gray-300 px-2 py-1 w-16 rounded-r"
                    min=""
                    max="100"
                  />
                </div>

                {/* Input untuk Velocity */}
                <div className="flex items-center">
                  <div className="bg-blue_s text-white p-2 rounded-l">
                    Velocity
                  </div>
                  <input
                    type="number"
                    value={newWeights.velocity}
                    onChange={(e) =>
                      handleWeightChange("velocity", e.target.value)
                    }
                    className="border text-grey_s border-gray-300 px-2 py-1 w-16 rounded-r"
                    min="0"
                    max="100"
                  />
                </div>

                {/* Input untuk Bug Fix Score */}
                <div className="flex items-center">
                  <div className="bg-red text-white p-2 rounded-l">Bug Fix</div>
                  <input
                    type="number"
                    value={newWeights.bugFix}
                    onChange={(e) =>
                      handleWeightChange("bugFix", e.target.value)
                    }
                    className="border text-grey_s border-gray-300 px-2 py-1 w-16 rounded-r"
                    min="0"
                    max="100"
                  />
                </div>

                <button
                  onClick={handleRecalculate}
                  className="bg-purple_s text-white px-4 py-1 rounded hover:bg-purple-700"
                >
                  Calculate
                </button>
              </div>
            </div>

            {weightError && (
              <div className="bg-red-100 text-red px-4 py-2 rounded mb-4">
                {weightError}
              </div>
            )}

            <table className="min-w-full border-collapse border border-grey-700">
              <thead>
                <tr className="bg-purple_s">
                  <th className="border px-4 py-2 text-center">Name</th>
                  <th className="border px-4 py-2 text-center w-[30%]">
                    Developer Performance Score
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
                      <td className="border px-4 py-2 text-grey_s text-center w-[30%]">
                        {dev.score.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="border px-4 py-2 text-grey_s text-center"
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
