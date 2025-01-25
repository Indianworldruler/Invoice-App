import React, { useState } from 'react';
import FraudDetector from './advanced-fraud-detection.js';
import { InvoiceParser } from './invoice-parser-enhanced.js';

const FraudDetectionApp = () => {
    const [fraudResults, setFraudResults] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const fraudDetector = new FraudDetector();

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        
        try {
            // Parse invoice
            const parsedInvoice = await InvoiceParser.parse(file);
            setInvoiceData(parsedInvoice);

            // Detect fraud
            const fraudAnalysis = await fraudDetector.detectFraud(parsedInvoice);
            setFraudResults(fraudAnalysis);
        } catch (error) {
            console.error('Fraud detection error:', error);
        }
    };

    return (
        <div className="container">
            <h1>Advanced Invoice Fraud Detector</h1>
            
            <input 
                type="file" 
                onChange={handleFileUpload}
                accept=".pdf,.xls,.xlsx,.doc,.docx"
            />

            {invoiceData && (
                <div className="invoice-details">
                    <h2>Invoice Details</h2>
                    <pre>{JSON.stringify(invoiceData, null, 2)}</pre>
                </div>
            )}

            {fraudResults && (
                <div className={`fraud-results ${fraudResults.isFraudulent ? 'alert-danger' : 'alert-success'}`}>
                    <h2>Fraud Analysis</h2>
                    <p>Fraudulent: {fraudResults.isFraudulent ? 'Yes' : 'No'}</p>
                    <p>Fraud Score: {fraudResults.fraudScore}</p>
                    
                    {fraudResults.details.map((detail, index) => (
                        <div key={index} className="fraud-detail">
                            {detail.reason}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FraudDetectionApp;
