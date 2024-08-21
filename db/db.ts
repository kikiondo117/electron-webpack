import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://kikiondo:kikiondo_20@cluster0.z6ae7.mongodb.net/logs?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("ERROR :c", err);
    process.exit(1);
  }
};
