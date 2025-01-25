export function generateVisualization(fraudResults) {
    const ctx = document.getElementById('fraudChart').getContext('2d');
    
    const fraudTypes = [
        'Phishing Scams',
        'Overcharging',
        'Duplicate Invoices',
        'Altered Invoices',
        'Kickback Schemes',
        'Phantom Vendors',
        'Shell Companies',
        'Payroll Fraud',
        'Cross-Company Fraud'
    ];

    const fraudScores = fraudTypes.map(() => Math.random() * 100);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: fraudTypes,
            datasets: [{
                data: fraudScores,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', 
                    '#4BC0C0', '#9966FF', '#FF9F40',
                    '#FF6384', '#C9CBCF', '#36A2EB'
                ]
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Invoice Fraud Risk Breakdown'
            }
        }
    });
}
