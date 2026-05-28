const RawData = require("../models/RawData");
const EmissionRecord = require("../models/EmissionRecord");
const fs = require("fs");

const parseCSV = require("../services/csvParser");

const normalizeRecord = require(
  "../services/normalizationService"
);

const detectSuspiciousRecord = require(
  "../services/suspiciousDetector"
);

// ============================
// SAP Upload
// ============================

const uploadSAPData = async (req, res) => {
  let filePath = null;
  try {
    // Check File
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    filePath = req.file.path;

    // Verify file exists
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        success: false,
        message: "File upload failed - file not found",
      });
    }

    // Parse CSV
    const rows = await parseCSV(filePath);

    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "CSV file is empty",
      });
    }

    // Prepare Raw Data
    const rawDocuments = rows.map((row) => ({
      sourceType: "sap",
      originalRow: row,
      fileName: req.file.filename,
      processingStatus: "uploaded",
    }));

    // Store Raw Data
    const savedRawData = await RawData.insertMany(
      rawDocuments
    );

    // Normalize + Detect Suspicious
    const normalizedRecords = savedRawData.map((doc) => {
      // Normalize Data
      const normalizedData = normalizeRecord(
        doc.sourceType,
        doc.originalRow
      );

      // Detect Suspicious
      const suspiciousResult =
        detectSuspiciousRecord(
          doc.sourceType,
          doc.originalRow,
          normalizedData
        );

      return {
        rawDataId: doc._id,
        sourceType: doc.sourceType,
        category: normalizedData.category,
        scope: normalizedData.scope,
        normalizedValue: normalizedData.normalizedValue,
        unit: normalizedData.unit,
        status: suspiciousResult.status,
        suspiciousFlags:
          suspiciousResult.suspiciousFlags,
        recordDate: normalizedData.date,
      };
    });

    // Store Normalized Records
    await EmissionRecord.insertMany(normalizedRecords);

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      message: "SAP CSV uploaded successfully",
      totalRows: rows.length,
    });
  } catch (error) {
    console.error("SAP Upload Error:", error);

    // Clean up file if it exists
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: `SAP upload failed: ${error.message}`,
    });
  }
};

// ============================
// Utility Upload
// ============================

const uploadUtilityData = async (req, res) => {
  let filePath = null;
  try {
    // Check File
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    filePath = req.file.path;

    // Verify file exists
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        success: false,
        message: "File upload failed - file not found",
      });
    }

    // Parse CSV
    const rows = await parseCSV(filePath);

    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "CSV file is empty",
      });
    }

    // Prepare Raw Data
    const rawDocuments = rows.map((row) => ({
      sourceType: "utility",
      originalRow: row,
      fileName: req.file.filename,
      processingStatus: "uploaded",
    }));

    // Store Raw Data
    const savedRawData = await RawData.insertMany(
      rawDocuments
    );

    // Normalize + Detect Suspicious
    const normalizedRecords = savedRawData.map((doc) => {
      // Normalize Data
      const normalizedData = normalizeRecord(
        doc.sourceType,
        doc.originalRow
      );

      // Detect Suspicious
      const suspiciousResult =
        detectSuspiciousRecord(
          doc.sourceType,
          doc.originalRow,
          normalizedData
        );

      return {
        rawDataId: doc._id,
        sourceType: doc.sourceType,
        category: normalizedData.category,
        scope: normalizedData.scope,
        normalizedValue: normalizedData.normalizedValue,
        unit: normalizedData.unit,
        status: suspiciousResult.status,
        suspiciousFlags:
          suspiciousResult.suspiciousFlags,
        recordDate: normalizedData.date,
      };
    });

    // Store Normalized Records
    await EmissionRecord.insertMany(normalizedRecords);

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      message: "Utility CSV uploaded successfully",
      totalRows: rows.length,
    });
  } catch (error) {
    console.error("Utility Upload Error:", error);

    // Clean up file if it exists
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: `Utility upload failed: ${error.message}`,
    });
  }
};

// ============================
// Travel Upload
// ============================

const uploadTravelData = async (req, res) => {
  let filePath = null;
  try {
    // Check File
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    filePath = req.file.path;

    // Verify file exists
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        success: false,
        message: "File upload failed - file not found",
      });
    }

    // Parse CSV
    const rows = await parseCSV(filePath);

    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "CSV file is empty",
      });
    }

    // Prepare Raw Data
    const rawDocuments = rows.map((row) => ({
      sourceType: "travel",
      originalRow: row,
      fileName: req.file.filename,
      processingStatus: "uploaded",
    }));

    // Store Raw Data
    const savedRawData = await RawData.insertMany(
      rawDocuments
    );

    // Normalize + Detect Suspicious
    const normalizedRecords = savedRawData.map((doc) => {
      // Normalize Data
      const normalizedData = normalizeRecord(
        doc.sourceType,
        doc.originalRow
      );

      // Detect Suspicious
      const suspiciousResult =
        detectSuspiciousRecord(
          doc.sourceType,
          doc.originalRow,
          normalizedData
        );

      return {
        rawDataId: doc._id,
        sourceType: doc.sourceType,
        category: normalizedData.category,
        scope: normalizedData.scope,
        normalizedValue: normalizedData.normalizedValue,
        unit: normalizedData.unit,
        status: suspiciousResult.status,
        suspiciousFlags:
          suspiciousResult.suspiciousFlags,
        recordDate: normalizedData.date,
      };
    });

    // Store Normalized Records
    await EmissionRecord.insertMany(normalizedRecords);

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      message: "Travel CSV uploaded successfully",
      totalRows: rows.length,
    });
  } catch (error) {
    console.error("Travel Upload Error:", error);

    // Clean up file if it exists
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: `Travel upload failed: ${error.message}`,
    });
  }
};

module.exports = {
  uploadSAPData,
  uploadUtilityData,
  uploadTravelData,
};