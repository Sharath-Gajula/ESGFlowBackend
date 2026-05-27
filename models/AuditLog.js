const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    recordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmissionRecord",
      required: true,
    },

    action: {
      type: String,
      required: true,
      enum: ["approved", "rejected", "edited"],
    },

    performedBy: {
      type: String,
      default: "Analyst",
    },

    comments: {
      type: String,
    },

    actionTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);