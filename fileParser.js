const cheerio = require("cheerio");
const pdfParse = require("pdf-parse");
const xlsx = require("xlsx");
const fs = require("fs");

const parseFile = async (filePath) => {
  const fileType = path.extname(filePath).toLowerCase();
  let results = {};

  if (fileType === ".pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    results = analyzeText(pdfData.text);
  } else if ([".xls", ".xlsx"].includes(fileType)) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    results = analyzeData(data);
  } else {
    throw new Error("Unsupported file format.");
  }

  return results;
};

const analyzeText = (text) => {
  // Implement fraud detection logic for text
  return {
    fakeInvoices: 0,
    overcharging: 2,
    duplicateInvoices: 1,
  };
};

const analyzeData = (data) => {
  // Implement fraud detection logic for structured data
  return {
    fakeInvoices: 1,
    overcharging: 1,
    alteredInvoices: 1,
  };
};

module.exports = { parseFile };
