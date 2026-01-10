import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./data/db.js";
import { seedTopicsIfEmpty } from "./seeds/seedTopics.js";

import loginRoutes from './routes/loginRoute.js';
import registerRoutes from './routes/registerRoute.js';
import topicRoutes from "./routes/topicRoute.js";
import postRouter from "./routes/postRouter.js";
import likeRoutes from "./routes/likeRoute.js";

import "./data/userModel.js";
import "./data/postModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ CORS גמיש לכל ה‑origins הרלוונטיים
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3003",
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


// Routes
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/posts", postRouter);
app.use("/api/likes", likeRoutes);
const PORT = process.env.PORT;

try {
  await connectDB();
  console.log("✅ Mongo connected");

  await seedTopicsIfEmpty();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
} catch (err) {
  console.error("❌ Mongo connection failed", err);
  throw err;
}
