import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DefectChartProps {
  defects: { critical: number; high: number; medium: number; low: number };
}

const DefectChart: React.FC<DefectChartProps> = ({ defects }) => {
  const data = {
    labels: ["Critical", "High", "Medium", "Low"],
    datasets: [
      {
        label: "Defects",
        data: [defects.critical, defects.high, defects.medium, defects.low],
        backgroundColor: ["#ff4d4d", "#ff751a", "#ffcc00", "#66ccff"],
        borderColor: ["#cc0000", "#e65c00", "#e6b800", "#3399ff"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-lg text-purple_s font-semibold mb-4">Defect Chart</h2>
      <Bar data={data} />
    </div>
  );
};

export default DefectChart;
