import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connectDB } from "./data/db.js";

import rubberDuckRoutes from "./routes/rubberDucks.js";
import topicRoutes from "./routes/topicRoute.js";
import routesPosts from "./routes/routesPosts.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware שמטפל ב-CORS ו-preflight
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001"); // כתובת ה-frontend שלך
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // מחזיר 200 לכל preflight
  }

  next();
});

app.use(express.json());

// static
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
