import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: [true, "Log text is required"],
  },
  priority: {
    type: String,
    default: "Low",
    enum: ["Low", "Moderate", "High"],
  },
  user: {
    type: String,
    trim: true,
    required: [true, "User is required"],
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export const LogModel = mongoose.model("Log", LogSchema);
