// index.js (or server.js)
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { read, utils } = require("xlsx");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/excel-data", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Mongoose Schema and Model
const excelDataSchema = new mongoose.Schema(
  {
    Category: String,
    Value: Number,
  },
  { timestamps: true }
);
const ExcelData = mongoose.model("ExcelData", excelDataSchema);

// Multer setup for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded.");

    // Parse Excel file
    const workbook = read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(sheet);

    // Insert data into MongoDB
    await ExcelData.insertMany(jsonData);
    res.status(200).send("File data successfully uploaded to MongoDB.");
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error processing the file.");
  }
});

// Route to fetch data
app.get("/data", async (req, res) => {
  try {
    const data = await ExcelData.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data.");
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
