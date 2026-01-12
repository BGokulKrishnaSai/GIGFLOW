const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a gig title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    budget: {
      type: Number,
      required: [true, "Please provide a budget"],
      min: 0,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "assigned"],
      default: "open",
    },
    category: {
      type: String,
      default: "General",
    },
    skills: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gig", gigSchema);
