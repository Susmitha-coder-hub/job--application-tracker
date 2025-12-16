const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 🔥 MUST be "User"
      required: true,
    },

    stage: {
      type: String,
      default: "Applied",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
