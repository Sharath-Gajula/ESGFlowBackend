const express = require("express");

const router = express.Router();

const {
  getAllRecords,
  getRecordById,
} = require("../controllers/recordController");

// GET ALL RECORDS
router.get("/", getAllRecords);

// GET SINGLE RECORD
router.get("/:id", getRecordById);

module.exports = router;