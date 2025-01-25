// Advanced Machine Learning Fraud Detection Approach
class FraudDetector {
    constructor() {
        this.vendorDatabase = new VendorDatabase();
        this.invoiceDatabase = new InvoiceDatabase();
        this.aiModel = new FraudPredictionModel();
    }

    async detectFraud(invoiceData) {
        const checks = [
            this.machineLearningFraudPrediction(invoiceData),
            this.vendorVerification(invoiceData),
            this.anomalyDetection(invoiceData),
            this.patternRecognition(invoiceData),
            this.crossReferenceChecks(invoiceData)
        ];

        const fraudResults = await Promise.all(checks);
        return {
            isFraudulent: fraudResults.some(result => result.suspicious),
            details: fraudResults.filter(result => result.suspicious),
            fraudScore: this.calculateFraudScore(fraudResults)
        };
    }

    async machineLearningFraudPrediction(invoiceData) {
        const predictionScore = await this.aiModel.predict(invoiceData);
        return {
            suspicious: predictionScore > 0.7,
            reason: `AI Fraud Prediction Score: ${predictionScore.toFixed(2)}`
        };
    }

    async vendorVerification(invoiceData) {
        const vendorDetails = await this.vendorDatabase.verify(invoiceData.sellerName);
        return {
            suspicious: !vendorDetails.verified,
            reason: vendorDetails.verified 
                ? 'Vendor Verified' 
                : 'Unverified Vendor Detected'
        };
    }

    anomalyDetection(invoiceData) {
        const anomalies = this.detectStatisticalAnomalies(invoiceData);
        return {
            suspicious: anomalies.length > 0,
            reason: anomalies.join(', ')
        };
    }

    detectStatisticalAnomalies(invoiceData) {
        const anomalies = [];
        const thresholds = {
            amountVariance: 1.5, // Standard deviations
            frequencyThreshold: 3 // Max invoices in short period
        };

        // Check amount against historical data
        const historicalInvoices = this.invoiceDatabase.getInvoicesByVendor(invoiceData.sellerName);
        const amountZScore = this.calculateZScore(
            invoiceData.totalAmount, 
            historicalInvoices.map(inv => inv.totalAmount)
        );

        if (Math.abs(amountZScore) > thresholds.amountVariance) {
            anomalies.push('Statistically Unusual Invoice Amount');
        }

        return anomalies;
    }

    calculateZScore(value, dataset) {
        const mean = dataset.reduce((a, b) => a + b, 0) / dataset.length;
        const stdDev = Math.sqrt(
            dataset.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / dataset.length
        );
        return (value - mean) / stdDev;
    }

    async patternRecognition(invoiceData) {
        const suspiciousPatterns = [
            /urgent payment/i,
            /immediate transfer/i,
            /confidential/i
        ];

        const textToCheck = JSON.stringify(invoiceData).toLowerCase();
        const patternMatches = suspiciousPatterns.filter(pattern => 
            pattern.test(textToCheck)
        );

        return {
            suspicious: patternMatches.length > 0,
            reason: patternMatches.length 
                ? `Suspicious Patterns Detected: ${patternMatches.join(', ')}` 
                : 'No Suspicious Patterns'
        };
    }

    async crossReferenceChecks(invoiceData) {
        const relatedInvoices = this.invoiceDatabase.findSimilarInvoices(invoiceData);
        return {
            suspicious: relatedInvoices.length > 1,
            reason: relatedInvoices.length > 1 
                ? `Multiple Similar Invoices Detected: ${relatedInvoices.length}` 
                : 'No Duplicate Invoices'
        };
    }

    calculateFraudScore(fraudResults) {
        return fraudResults.reduce((score, result) => 
            result.suspicious ? score + 20 : score, 0
        );
    }
}

class VendorDatabase {
    constructor() {
        // In-memory mock database
        this.vendors = {
            'Acme Corporation': { verified: true, taxId: '12-3456789' },
            'Phantom Services LLC': { verified: false }
        };
    }

    async verify(vendorName) {
        return this.vendors[vendorName] || { verified: false };
    }
}

class InvoiceDatabase {
    constructor() {
        // In-memory mock database
        this.invoices = [
            { 
                sellerName: 'Acme Corporation', 
                totalAmount: 1000,
                date: '2023-01-15'
            }
        ];
    }

    getInvoicesByVendor(vendorName) {
        return this.invoices.filter(inv => inv.sellerName === vendorName);
    }

    findSimilarInvoices(invoiceData) {
        return this.invoices.filter(inv => 
            inv.sellerName === invoiceData.sellerName &&
            Math.abs(inv.totalAmount - invoiceData.totalAmount) < 100
        );
    }
}

class FraudPredictionModel {
    async predict(invoiceData) {
        // Simplified mock ML prediction
        const features = this.extractFeatures(invoiceData);
        return this.simulatePrediction(features);
    }

    extractFeatures(invoiceData) {
        return {
            amount: invoiceData.totalAmount,
            vendorNameLength: invoiceData.sellerName.length,
            itemCount: invoiceData.items ? invoiceData.items.length : 0
        };
    }

    simulatePrediction(features) {
        // Mock ML scoring logic
        const baseScore = 0.5;
        const riskFactors = [
            features.amount > 10000 ? 0.2 : 0,
            features.vendorNameLength < 5 ? 0.1 : 0,
            features.itemCount === 0 ? 0.1 : 0
        ];

        return Math.min(
            baseScore + riskFactors.reduce((a, b) => a + b, 0),
            1.0
        );
    }
}

export default FraudDetector;
