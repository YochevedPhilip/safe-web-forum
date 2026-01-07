import express from 'express';
import { userController } from '../controllers/userController.js';

const router = express.Router();

// router.post("/", (req, res) => {
//   console.log("register button pressed");
//   res.send("button pressed")
// })

router.post("/", userController.login);

export default router;