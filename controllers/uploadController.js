const RawData = require("../models/RawData");
const EmissionRecord = require("../models/EmissionRecord");

const parseCSV = require("../services/csvParser");

const normalizeRecord = require(
  "../services/normalizationService"
);

const detectSuspiciousRecord = require(
  "../services/suspiciousDetector"
);

// ========================================
// COMMON CSV PROCESSOR
// ========================================

const processUpload = async (
  req,
  res,
  sourceType,
  successMessage
) => {
  try {
    // Validate File
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    console.log(
      "Processing File:",
      req.file.originalname
    );

    // Parse CSV FROM BUFFER
    const rows = await parseCSV(
      req.file.buffer
    );

    console.log(
      "Parsed Rows:",
      rows.length
    );

    // Empty CSV Check
    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "CSV file is empty",
      });
    }

    // Prepare Raw Documents
    const rawDocuments = rows.map(
      (row) => ({
        sourceType,
        originalRow: row,

        fileName:
          req.file.originalname,

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

    // Store Emission Records
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