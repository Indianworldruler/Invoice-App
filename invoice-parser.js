import * as XLSX from 'xlsx';
import * as PDFLib from 'pdf-lib';
import mammoth from 'mammoth';

export class InvoiceParser {
    static async parse(file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        switch(fileExtension) {
            case 'pdf':
                return await this.parsePDF(file);
            case 'xls':
            case 'xlsx':
                return this.parseExcel(file);
            case 'doc':
            case 'docx':
                return await this.parseWord(file);
            default:
                throw new Error('Unsupported file format');
        }
    }

    static async parsePDF(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
        const pages = pdf.getPages();
        
        const extractedText = await Promise.all(
            pages.map(async page => {
                const { text } = await page.getTextContent();
                return text;
            })
        );

        return this.extractStructuredData(extractedText.join('\n'));
    }

    static parseExcel(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                resolve(this.extractStructuredData(JSON.stringify(data)));
            };
            reader.readAsBinaryString(file);
        });
    }

    static async parseWord(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
                    resolve(this.extractStructuredData(result.value));
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsArrayBuffer(file);
        });
    }

    static extractStructuredData(text) {
        const extractionPatterns = {
            invoiceNumber: /Invoice\s*#\s*:?\s*(\d+)/i,
            sellerName: /(?:Seller|Company):\s*(.+)/i,
            sellerAddress: /Address:\s*(.+?)(?:\n|\r|$)/i,
            totalAmount: /Total\s*(?:Amount|Due):\s*\$?\s*(\d+(?:\.\d{1,2})?)/i,
            invoiceDate: /(?:Invoice|Date):\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i,
            items: /(.+?)\s+(\d+)\s+\$?(\d+(?:\.\d{1,2})?)/g
        };

        const extractValue = (pattern) => {
            const match = text.match(pattern);
            return match ? match[1].trim() : null;
        };

        const extractItems = () => {
            const items = [];
            let match;
            const itemRegex = extractionPatterns.items;
            
            while ((match = itemRegex.exec(text)) !== null) {
                items.push({
                    description: match[1].trim(),
                    quantity: parseInt(match[2]),
                    unitPrice: parseFloat(match[3])
                });
            }
            
            return items;
        };

        return {
            invoiceNumber: extractValue(extractionPatterns.invoiceNumber),
            sellerName: extractValue(extractionPatterns.sellerName),
            sellerAddress: extractValue(extractionPatterns.sellerAddress),
            totalAmount: parseFloat(extractValue(extractionPatterns.totalAmount) || 0),
            invoiceDate: extractValue(extractionPatterns.invoiceDate),
            items: extractItems()
        };
    }
}

export default InvoiceParser;
