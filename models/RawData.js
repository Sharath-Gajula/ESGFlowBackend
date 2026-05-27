const mongoose = require("mongoose");

const rawDataSchema = new mongoose.Schema(
  {
    sourceType: {
      type: String,
      required: true,
      enum: ["sap", "utility", "travel"],
    },

    originalRow: {
      type: Object,
      required: true,
    },

    uploadTime: {
      type: Date,
      default: Date.now,
    },

    fileName: {
      type: String,
    },

    processingStatus: {
      type: String,
      default: "uploaded",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RawData", rawDataSchema);