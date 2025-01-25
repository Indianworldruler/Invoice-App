const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { parseFile } = require("./fileParser");
const app = express();
const port = 5000;

const upload = multer({ dest: "uploads/" });

app.post("/api/analyze", upload.single("invoice"), async (req, res) => {
  try {
    const filePath = path.join(__dirname, req.file.path);
    const analysisResults = await parseFile(filePath);
    fs.unlinkSync(filePath); // Delete uploaded file after parsing
    res.json(analysisResults);
  } catch (error) {
    console.error("Error during file analysis:", error);
    res.status(500).send("Error processing file.");
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
