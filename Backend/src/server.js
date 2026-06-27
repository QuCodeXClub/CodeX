import dotenv from "dotenv";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

import connectDB from "./config/db.js";
import app from "./app.js";
import { seedAdmin } from "./utils/seedAdmin.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 5000;
let server;

connectDB()
  .then(async () => {
    await seedAdmin();
    server = app.listen(PORT, () => {
      console.log(`Server is running at: ${process.env.SERVER_URL || `http://localhost:${PORT}`}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!! ", err);
  });

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
