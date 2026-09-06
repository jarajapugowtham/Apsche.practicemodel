import mongoose from "mongoose";

/* =========================================================
   CONNECT TO MONGODB
========================================================= */

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error(
        "MONGODB_URI is not configured in environment variables."
      );
    }

    const connection =
      await mongoose.connect(
        mongoURI
      );

    console.log(
      `✅ MongoDB connected: ${connection.connection.host}`
    );

    return connection;
  } catch (error) {
    console.error(
      "❌ MongoDB connection failed:",
      error.message
    );

    /*
      Stop the backend when the database
      connection cannot be established.
    */

    process.exit(1);
  }
};

/* =========================================================
   DATABASE EVENTS
========================================================= */

mongoose.connection.on(
  "disconnected",
  () => {
    console.warn(
      "⚠️ MongoDB disconnected"
    );
  }
);

mongoose.connection.on(
  "error",
  (error) => {
    console.error(
      "❌ MongoDB error:",
      error.message
    );
  });

export default connectDB;
