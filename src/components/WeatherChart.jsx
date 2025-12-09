import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function WeatherChart({ forecastData }) {
  const labels = forecastData.map((day) => day.day);

  const data = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: forecastData.map((day) => day.temp),
        borderColor: "rgba(59, 130, 246, 1)", // Tailwind blue-500
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        yAxisID: "yTemp",
        tension: 0.3,
      },
      {
        label: "Rainfall (mm)",
        data: forecastData.map((day) => day.rain || 0), // fallback to 0 if no rain data
        borderColor: "rgba(34, 197, 94, 1)", // Tailwind green-500
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        yAxisID: "yRain",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      yTemp: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
      yRain: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Rainfall (mm)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "5-Day Weather Trends",
      },
    },
  };

  return <Line data={data} options={options} />;
}
