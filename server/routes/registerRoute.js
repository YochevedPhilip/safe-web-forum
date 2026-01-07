import { userController } from "../controllers/userController.js";
import express from 'express';

const router = express.Router();
// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: true }));
// const User = mongoose.model('User', userSchema);

// router.post("/", (req, res) => {
//   console.log("register button pressed");
//   res.send("button pressed")
// })

router.post("/", userController.register);

export default router;
