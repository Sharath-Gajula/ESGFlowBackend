// services/normalizationService.js

const normalizeRecord = (sourceType, row) => {
  let normalizedData = {
    sourceType,
    category: "",
    scope: "",
    amount: 0,
    unit: "",
    normalizedValue: 0,
    normalizedUnit: "",
    date: new Date(),
  };

  // =========================
  // SAP DATA
  // =========================

  if (sourceType === "sap") {
    normalizedData.category = "fuel";

    normalizedData.scope = "Scope 1";

    normalizedData.amount = Number(
      row.quantity ||
      row.Quantity ||
      row.amount ||
      row.Amount ||
      0
    );

    normalizedData.unit =
      row.unit ||
      row.Unit ||
      "KL";

    // Normalize KL → Liters
    if (normalizedData.unit === "KL") {
      normalizedData.normalizedValue =
        normalizedData.amount * 1000;

      normalizedData.normalizedUnit =
        "liters";
    } else {
      normalizedData.normalizedValue =
        normalizedData.amount;

      normalizedData.normalizedUnit =
        normalizedData.unit;
    }
  }

  // =========================
  // UTILITY DATA
  // =========================

  else if (sourceType === "utility") {
    normalizedData.category =
      "electricity";

    normalizedData.scope = "Scope 2";

    normalizedData.amount = Number(
  row.electricity_usage ||
  row.usage ||
  row.Usage ||
  row.amount ||
  row.Amount ||
  0
);

    normalizedData.unit =
      row.unit ||
      row.Unit ||
      "MWh";

    // Normalize MWh → kWh
    if (normalizedData.unit === "MWh") {
      normalizedData.normalizedValue =
        normalizedData.amount * 1000;

      normalizedData.normalizedUnit =
        "kWh";
    } else {
      normalizedData.normalizedValue =
        normalizedData.amount;

      normalizedData.normalizedUnit =
        normalizedData.unit;
    }
  }

  // =========================
  // TRAVEL DATA
  // =========================

  else if (sourceType === "travel") {
    normalizedData.category = "travel";

    normalizedData.scope = "Scope 3";

    normalizedData.amount = Number(
      row.distance ||
      row.Distance ||
      row.amount ||
      row.Amount ||
      0
    );

    normalizedData.unit =
      row.unit ||
      row.Unit ||
      "km";

    normalizedData.normalizedValue =
      normalizedData.amount;

    normalizedData.normalizedUnit =
      normalizedData.unit;
  }

  return normalizedData;
};

module.exports = normalizeRecord;