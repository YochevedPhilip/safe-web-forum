import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

import rubberDuckRoutes from "./routes/rubberDucks.js";
import topicRoutes from "./routes/topicRoute.js";
import { connectDB } from "./data/db.js";
import routesPosts from "./routes/routesPosts.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

// static
app.use("/images", express.static(path.join(__dirname, "images")));

// routes
app.use("/ducks", rubberDuckRoutes);

app.use("/api/topics", topicRoutes);

app.use("/posts", routesPosts);

const PORT = process.env.PORT || 3000;

try {
  await connectDB();
  console.log("✅ Mongo connected");

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
} catch (err) {
  console.error("❌ Mongo connection failed", err);
  throw err; 
}
