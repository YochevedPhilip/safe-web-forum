import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import rubberDuckRoutes from './routes/rubberDucks.js'; // Import the routes
import loginRoutes from './routes/loginService.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static images

// app.use(cors({
//   origin: process.env.CLIENT_URL
// }));

app.use(cors())

app.use(express.json());

// app.post("/login", (req, res) => {
//   console.log("Login button pressed");
//   res.send("Create User")
// })

// Use the routes file for all `/ducks` routes
app.use('/ducks', rubberDuckRoutes);
app.use('/login', loginRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
