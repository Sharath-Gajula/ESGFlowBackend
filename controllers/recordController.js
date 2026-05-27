const EmissionRecord = require(
  "../models/EmissionRecord"
);

// GET ALL RECORDS
const getAllRecords = async (req, res) => {
  try {
    const records = await EmissionRecord.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET SINGLE RECORD
const getRecordById = async (req, res) => {
  try {
    const record = await EmissionRecord.findById(
      req.params.id
    ).populate("rawDataId");

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      record,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getAllRecords,
  getRecordById,
};
