const express = require("express");

const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");

const {
  uploadSAPData,
  uploadUtilityData,
  uploadTravelData,
} = require("../controllers/uploadController");

// SAP Upload
router.post(
  "/sap",
  upload.single("file"),
  uploadSAPData
);

// Utility Upload
router.post(
  "/utility",
  upload.single("file"),
  uploadUtilityData
);

// Travel Upload
router.post(
  "/travel",
  upload.single("file"),
  uploadTravelData
);

module.exports = router;