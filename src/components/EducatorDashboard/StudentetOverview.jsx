import { Card } from "react-bootstrap";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StudentEngagementOverview() {
  const data = {
    labels: ["August", "September", "October"],
    datasets: [
      {
        label: "Engagement Rate",
        data: [85, 90, 95],
        backgroundColor: [
          "#3390ec",
          "#1a3967",
          "#84bbf2"
        ],
        borderRadius: 12,
        barThickness: 40,
      },
    ],
  };

  const options = {
    indexAxis: "x", // vertical bars
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}%`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
          color: "#1a3967",
          font: { weight: "bold" },
        },
        grid: { color: "#e3f0fd" },
      },
      x: {
        ticks: { color: "#1a3967", font: { weight: "bold" } },
        grid: { display: false },
      },
    },
  };

  return (
    <>
      <h4 className="fw-bold mb-4 " style={{ color: "#1a3967" }}>Student Engagement Overview</h4>
      <Card className="mb-4 shadow-sm border-1" style={{ borderRadius: "1.5rem" }}>
        <Card.Body>
          <div className="mt-3 text-muted">
              <p className="me-2 fw-bold" style={{ color: "#1a3967" }}>Overall Engagement Rate:</p>
            <h2 className="fw-bold " style={{ color: "#1a3967" }} >85%</h2>
            <p style={{ color: "#3390ec" }} >This metric shows the average engagement rate of students across all courses over the past three months.</p>
          </div>
          <Bar data={data} options={options} height={100} />
        </Card.Body>
      </Card>
    </>
  );
}
