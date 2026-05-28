const RawData = require("../models/RawData");
const EmissionRecord = require("../models/EmissionRecord");

const fs = require("fs");
const path = require("path");

const parseCSV = require("../services/csvParser");

const normalizeRecord = require(
  "../services/normalizationService"
);

const detectSuspiciousRecord = require(
  "../services/suspiciousDetector"
);

// ========================================
// COMMON UPLOAD HANDLER
// ========================================

const processUpload = async (
  req,
  res,
  sourceType,
  successMessage
) => {
  try {
    // Check File
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    // Absolute File Path
    const filePath = path.resolve(
      req.file.path
    );

    console.log(
      "Resolved File Path:",
      filePath
    );

    // Verify File Exists
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        success: false,
        message:
          "Uploaded file not found",
      });
    }

    // Parse CSV
    const rows = await parseCSV(
      filePath
    );

    // Check Empty CSV
    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "CSV file is empty",
      });
    }

    // Prepare Raw Data
    const rawDocuments = rows.map(
      (row) => ({
        sourceType,
        originalRow: row,
        fileName:
          req.file.filename,
        processingStatus:
          "uploaded",
      })
    );

    // Store Raw Data
    const savedRawData =
      await RawData.insertMany(
        rawDocuments
      );

    // Normalize + Detect Suspicious
    const normalizedRecords =
      savedRawData.map((doc) => {
        // Normalize
        const normalizedData =
          normalizeRecord(
            doc.sourceType,
            doc.originalRow
          );

        // Suspicious Detection
        const suspiciousResult =
          detectSuspiciousRecord(
            doc.sourceType,
            doc.originalRow,
            normalizedData
          );

        return {
          rawDataId: doc._id,
          sourceType:
            doc.sourceType,
          category:
            normalizedData.category,
          scope:
            normalizedData.scope,
          normalizedValue:
            normalizedData.normalizedValue,
          unit:
            normalizedData.unit,
          status:
            suspiciousResult.status,
          suspiciousFlags:
            suspiciousResult.suspiciousFlags,
          recordDate:
            normalizedData.date,
        };
      });

    // Store Normalized Records
    await EmissionRecord.insertMany(
      normalizedRecords
    );

    // Success Response
    res.status(201).json({
      success: true,
      message: successMessage,
      totalRows: rows.length,
    });
  } catch (error) {
    console.error(
      "UPLOAD ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// SAP Upload
// ========================================

const uploadSAPData = async (
  req,
  res
) => {
  await processUpload(
    req,
    res,
    "sap",
    "SAP CSV uploaded successfully"
  );
};

// ========================================
// Utility Upload
// ========================================

const uploadUtilityData = async (
  req,
  res
) => {
  await processUpload(
    req,
    res,
    "utility",
    "Utility CSV uploaded successfully"
  );
};

// ========================================
// Travel Upload
// ========================================

const uploadTravelData = async (
  req,
  res
) => {
  await processUpload(
    req,
    res,
    "travel",
    "Travel CSV uploaded successfully"
  );
};

module.exports = {
  uploadSAPData,
  uploadUtilityData,
  uploadTravelData,
};