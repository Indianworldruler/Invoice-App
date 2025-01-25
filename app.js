import React, { useState, useRef } from 'react';
import { parseInvoice } from './invoice-parser.js';
import { detectFraud } from './fraud-detection.js';
import { generateVisualization } from './visualization.js';

const InvoiceFraudDetectionApp = () => {
    const [invoiceData, setInvoiceData] = useState(null);
    const [fraudResults, setFraudResults] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            // Parse invoice based on file type
            const parsedData = await parseInvoice(file);
            setInvoiceData(parsedData);

            // Detect potential fraud
            const fraudDetectionResults = detectFraud(parsedData);
            setFraudResults(fraudDetectionResults);

            // Generate visualization
            generateVisualization(fraudDetectionResults);
        } catch (error) {
            console.error('Invoice processing error:', error);
            alert('Failed to process invoice. Please check file format.');
        }
    };

    return (
        <div className="container">
            <div className="invoice-upload-container">
                <h2 className="text-center mb-4">Invoice Fraud Detection</h2>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="file-upload-input"
                    accept=".pdf,.xls,.xlsx,.doc,.docx"
                    onChange={handleFileUpload}
                />
                <label 
                    className="file-upload-label w-100 text-center"
                    onClick={() => fileInputRef.current.click()}
                >
                    Upload Invoice
                </label>

                {fraudResults && (
                    <div className="fraud-detection-results mt-4">
                        <h3>Fraud Analysis Results</h3>
                        <div className={`alert ${fraudResults.isFraudulent ? 'fraud-alert' : 'safe-invoice'}`}>
                            {fraudResults.isFraudulent 
                                ? 'Potential Fraud Detected!' 
                                : 'Invoice Appears Legitimate'}
                        </div>
                        <canvas id="fraudChart"></canvas>
                        <div className="mt-3">
                            {fraudResults.details.map((detail, index) => (
                                <div key={index} className="mb-2">
                                    {detail}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoiceFraudDetectionApp;
