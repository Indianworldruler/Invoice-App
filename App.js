import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('/analyze-invoice', formData);
        setAnalysis(response.data.analysis);
      } catch (error) {
        console.error('Error analyzing invoice:', error);
      }
    }
  };

  const chartData = {
    labels: ['Fake Invoice', 'Overcharging', 'Duplicate Invoice', 'Altered Invoice', 'Kickback Scheme', 'Phantom Vendor', 'Shell Company', 'Payroll Fraud', 'Cross-Company Fraud'],
    datasets: [{
      data: [
        analysis?.fakeInvoice ? 1 : 0,
        analysis?.overcharging ? 1 : 0,
        analysis?.duplicateInvoice ? 1 : 0,
        analysis?.alteredInvoice ? 1 : 0,
        analysis?.kickback ? 1 : 0,
        analysis?.phantomVendor ? 1 : 0,
        analysis?.shellCompany ? 1 : 0,
        analysis?.payrollFraud ? 1 : 0,
        analysis?.crossCompanyFraud ? 1 : 0,
      ],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF6347', '#4CAF50', '#FF6347', '#FF8C00', '#8B0000', '#3CB371']
    }]
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Invoice Fraud Detection</h1>
        <input type="file" onChange={handleFileChange} accept=".pdf,.xls,.xlsx,.doc,.docx,.google-docs" />
        <button onClick={handleSubmit}>Analyze</button>

        {analysis && (
          <div>
            <h3>Analysis Results</h3>
            <ul>
              <li>Fake Invoice: {analysis.fakeInvoice ? 'Yes' : 'No'}</li>
              <li>Overcharging: {analysis.overcharging ? 'Yes' : 'No'}</li>
              <li>Duplicate Invoice: {analysis.duplicateInvoice ? 'Yes' : 'No'}</li>
              <li>Altered Invoice: {analysis.alteredInvoice ? 'Yes' : 'No'}</li>
              <li>Kickback Scheme: {analysis.kickback ? 'Yes' : 'No'}</li>
              <li>Phantom Vendor Fraud: {analysis.phantomVendor ? 'Yes' : 'No'}</li>
              <li>Shell Company Invoices: {analysis.shellCompany ? 'Yes' : 'No'}</li>
              <li>Payroll Fraud: {analysis.payrollFraud ? 'Yes' : 'No'}</li>
              <li>Cross-Company Fraud: {analysis.crossCompanyFraud ? 'Yes' : 'No'}</li>
            </ul>
            <Pie data={chartData} />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
