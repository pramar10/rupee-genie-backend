const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const { json } = require("body-parser");
env.config();

// routes
const userRoutes = require("./routes/user");

const DB_URL = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.fknsepb.mongodb.net/`;
// Connect DB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_URL, {
      dbName: process.env.MONGO_DB_DATABASE,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
connectDB();

// route
app.use(cors());
app.use(json());
app.use("/api", userRoutes);

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
