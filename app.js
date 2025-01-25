const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const resultsSection = document.getElementById('results');
const resultsContent = document.getElementById('results-content');
const chartCanvas = document.getElementById('analysis-chart');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const file = fileInput.files[0];
    if (file) {
        analyzeInvoice(file);
    }
});

function analyzeInvoice(file) {
    const formData = new FormData();
    formData.append('file', file);

    fetch('/analyze-invoice', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data);
        createChart(data.analysis);
    })
    .catch(error => console.error('Error:', error));
}

function displayResults(data) {
    resultsSection.style.display = 'block';
    resultsContent.innerHTML = `
        <h4>Fraud Detection Summary:</h4>
        <ul>
            <li>Fake Invoice: ${data.analysis.fakeInvoice ? 'Yes' : 'No'}</li>
            <li>Overcharging: ${data.analysis.overcharging ? 'Yes' : 'No'}</li>
            <li>Duplicate Invoice: ${data.analysis.duplicateInvoice ? 'Yes' : 'No'}</li>
            <li>Altered Invoice: ${data.analysis.alteredInvoice ? 'Yes' : 'No'}</li>
            <li>Kickback Scheme: ${data.analysis.kickback ? 'Yes' : 'No'}</li>
            <li>Phantom Vendor Fraud: ${data.analysis.phantomVendor ? 'Yes' : 'No'}</li>
            <li>Shell Company Invoices: ${data.analysis.shellCompany ? 'Yes' : 'No'}</li>
            <li>Payroll Fraud: ${data.analysis.payrollFraud ? 'Yes' : 'No'}</li>
            <li>Cross-Company Fraud: ${data.analysis.crossCompanyFraud ? 'Yes' : 'No'}</li>
        </ul>
    `;
}

function createChart(analysis) {
    const data = {
        labels: ['Fake Invoice', 'Overcharging', 'Duplicate Invoice', 'Altered Invoice', 'Kickback Scheme', 'Phantom Vendor', 'Shell Company', 'Payroll Fraud', 'Cross-Company Fraud'],
        datasets: [{
            data: [
                analysis.fakeInvoice ? 1 : 0,
                analysis.overcharging ? 1 : 0,
                analysis.duplicateInvoice ? 1 : 0,
                analysis.alteredInvoice ? 1 : 0,
                analysis.kickback ? 1 : 0,
                analysis.phantomVendor ? 1 : 0,
                analysis.shellCompany ? 1 : 0,
                analysis.payrollFraud ? 1 : 0,
                analysis.crossCompanyFraud ? 1 : 0,
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF6347', '#4CAF50', '#FF6347', '#FF8C00', '#8B0000', '#3CB371']
        }]
    };

    new Chart(chartCanvas, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + (tooltipItem.raw === 1 ? 'Fraudulent' : 'Clean');
                        }
                    }
                }
            }
        });
}
