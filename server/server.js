import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./data/db.js";

import rubberDuckRoutes from "./routes/rubberDucks.js";
import topicRoutes from "./routes/topicRoute.js";
import routesPosts from "./routes/routesPosts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ CORS גמיש לכל ה‑origins הרלוונטיים
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3004"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// JSON body parser
app.use(express.json());

// static files
app.use("/images", express.static(path.join(__dirname, "images")));

// routes
app.use("/ducks", rubberDuckRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/posts", routesPosts);

const PORT = process.env.PORT || 5001;

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
