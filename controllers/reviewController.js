const EmissionRecord = require(
  "../models/EmissionRecord"
);

const AuditLog = require(
  "../models/AuditLog"
);

// APPROVE RECORD
const approveRecord = async (req, res) => {
  try {
    const record = await EmissionRecord.findById(
      req.params.id
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    // Update Record
    record.status = "approved";
    record.reviewedBy = "Analyst";
    record.reviewedAt = new Date();

    await record.save();

    // Create Audit Log
    await AuditLog.create({
      recordId: record._id,
      action: "approved",
      performedBy: "Analyst",
      comments: "Record approved",
    });

    res.status(200).json({
      success: true,
      message: "Record approved successfully",
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

// REJECT RECORD
const rejectRecord = async (req, res) => {
  try {
    const record = await EmissionRecord.findById(
      req.params.id
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    // Update Record
    record.status = "rejected";
    record.reviewedBy = "Analyst";
    record.reviewedAt = new Date();

    await record.save();

    // Create Audit Log
    await AuditLog.create({
      recordId: record._id,
      action: "rejected",
      performedBy: "Analyst",
      comments: "Record rejected",
    });

    res.status(200).json({
      success: true,
      message: "Record rejected successfully",
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
  approveRecord,
  rejectRecord,
};


