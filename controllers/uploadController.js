const RawData = require("../models/RawData");
const EmissionRecord = require("../models/EmissionRecord");

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
  try {
    // Check File
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    // Parse CSV
    const rows = await parseCSV(req.file.path);

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
        ...normalizedData,
        status: suspiciousResult.status,
        suspiciousFlags:
          suspiciousResult.suspiciousFlags,
      };
    });

    // Store Normalized Records
    await EmissionRecord.insertMany(normalizedRecords);

    res.status(201).json({
      success: true,
      message: "SAP CSV uploaded successfully",
      totalRows: rows.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ============================
// Utility Upload
// ============================

const uploadUtilityData = async (req, res) => {
  try {
    // Check File
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    // Parse CSV
    const rows = await parseCSV(req.file.path);

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
        ...normalizedData,
        status: suspiciousResult.status,
        suspiciousFlags:
          suspiciousResult.suspiciousFlags,
      };
    });

    // Store Normalized Records
    await EmissionRecord.insertMany(normalizedRecords);

    res.status(201).json({
      success: true,
      message: "Utility CSV uploaded successfully",
      totalRows: rows.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ============================
// Travel Upload
// ============================

const uploadTravelData = async (req, res) => {
  try {
    // Check File
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    // Parse CSV
    const rows = await parseCSV(req.file.path);

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
        ...normalizedData,
        status: suspiciousResult.status,
        suspiciousFlags:
          suspiciousResult.suspiciousFlags,
      };
    });

    // Store Normalized Records
    await EmissionRecord.insertMany(normalizedRecords);

    res.status(201).json({
      success: true,
      message: "Travel CSV uploaded successfully",
      totalRows: rows.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  uploadSAPData,
  uploadUtilityData,
  uploadTravelData,
};