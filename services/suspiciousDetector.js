const detectSuspiciousRecord = (
  sourceType,
  rawRow,
  normalizedData
) => {
  let suspiciousFlags = [];

  // -------------------------
  // Missing Unit Check
  // -------------------------

  if (
    !normalizedData.unit ||
    normalizedData.unit === ""
  ) {
    suspiciousFlags.push("Missing Unit");
  }

  // -------------------------
  // Date Detection
  // -------------------------

  let dateValue = null;

  // SAP
  if (sourceType === "sap") {
    dateValue =
      rawRow.date ||
      rawRow.transaction_date;
  }

  // Utility
  else if (sourceType === "utility") {
    dateValue =
      rawRow.billing_start_date ||
      rawRow.billing_end_date;
  }

  // Travel
  else if (sourceType === "travel") {
    dateValue =
      rawRow.travel_date ||
      rawRow.date;
  }

  // Invalid Date Check
  if (
    !dateValue ||
    isNaN(Date.parse(dateValue))
  ) {
    suspiciousFlags.push("Invalid Date");
  }

  // -------------------------
  // Negative Value Check
  // -------------------------

  if (
    normalizedData.normalizedValue < 0
  ) {
    suspiciousFlags.push(
      "Negative Value"
    );
  }

  // -------------------------
  // SAP Checks
  // -------------------------

  if (sourceType === "sap") {
    if (
      normalizedData.normalizedValue >
      500000
    ) {
      suspiciousFlags.push(
        "Abnormally High Fuel Usage"
      );
    }
  }

  // -------------------------
  // Utility Checks
  // -------------------------

  if (sourceType === "utility") {
    if (
      normalizedData.normalizedValue >
      1000000
    ) {
      suspiciousFlags.push(
        "Extremely High Electricity Usage"
      );
    }
  }

  // -------------------------
  // Travel Checks
  // -------------------------

  if (sourceType === "travel") {
    if (
      !rawRow.from_airport ||
      !rawRow.to_airport
    ) {
      suspiciousFlags.push(
        "Missing Airport Code"
      );
    }
  }

  // -------------------------
  // Final Status
  // -------------------------

  let status = "pending";

  if (suspiciousFlags.length > 0) {
    status = "suspicious";
  }

  return {
    status,
    suspiciousFlags,
  };
};

module.exports =
  detectSuspiciousRecord;