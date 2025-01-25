import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const App = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("invoice", file);

    try {
      const response = await axios.post("http://localhost:5000/api/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error analyzing file:", error);
      alert("Failed to analyze the file.");
    }
  };

  const renderChart = () => {
    if (results) {
      const ctx = document.getElementById("fraudChart").getContext("2d");
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.keys(results),
          datasets: [
            {
              data: Object.values(results),
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
            },
          ],
        },
      });
    }
  };

  return (
    <div className="container">
      <div className="card p-4">
        <h3>Fraud Detection App</h3>
        <input type="file" className="form-control mt-3" onChange={handleFileChange} />
        <button className="btn btn-primary mt-3" onClick={handleUpload}>
          Analyze Invoice
        </button>
      </div>
      {results && (
        <div id="chartContainer">
          <canvas id="fraudChart"></canvas>
          {renderChart()}
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
