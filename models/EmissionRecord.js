const mongoose = require("mongoose");

const emissionRecordSchema = new mongoose.Schema(
  {
    rawDataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawData",
      required: true,
    },

    sourceType: {
      type: String,
      required: true,
      enum: ["sap", "utility", "travel"],
    },

    category: {
      type: String,
      required: true,
    },

    scope: {
      type: String,
      enum: ["Scope 1", "Scope 2", "Scope 3"],
    },

    normalizedValue: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "suspicious",
        "approved",
        "rejected",
        "failed",
      ],
      default: "pending",
    },

    suspiciousFlags: [
      {
        type: String,
      },
    ],

    recordDate: {
      type: Date,
    },

    reviewedBy: {
      type: String,
    },

    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "EmissionRecord",
  emissionRecordSchema
);