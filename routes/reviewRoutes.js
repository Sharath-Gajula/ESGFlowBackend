const express = require("express");

const router = express.Router();

const {
  approveRecord,
  rejectRecord,
} = require("../controllers/reviewController");

// APPROVE RECORD
router.patch(
  "/:id/approve",
  approveRecord
);

// REJECT RECORD
router.patch(
  "/:id/reject",
  rejectRecord
);

module.exports = router;