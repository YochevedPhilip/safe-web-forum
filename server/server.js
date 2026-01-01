import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import rubberDuckRoutes from './routes/rubberDucks.js'; // Import the routes
import loginRoutes from './routes/loginRoute.js'
import registerRoutes from './routes/registerRoute.js'
import topicRoutes from "./routes/topicRoute.js";
import { connectDB } from "./data/db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static images

// app.use(cors({
//   origin: process.env.CLIENT_URL
// }));

app.use(cors())

// app.use(express.json());

// static
app.use("/images", express.static(path.join(__dirname, "images")));

// Use the routes file for all `/ducks` routes
app.use('/ducks', rubberDuckRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use("/api/topics", topicRoutes);

// Start server
const PORT = process.env.PORT || 3000;
try {
  await connectDB();
  console.log("✅ Mongo connected");

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
} catch (err) {
  console.error("❌ Mongo connection failed", err);
  throw err; // ✔️ במקום process.exit
}
