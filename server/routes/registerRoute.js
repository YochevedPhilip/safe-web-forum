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

// app.post('/', async (req, res) => {
//     try {
//         const newUser = new User({
//             username: req.body.username,
//             email: req.body.email,
//             password: req.body.password
//         });

//         await newUser.save();
//         res.send("Successfully registered!");
//     } catch (err) {
//         res.status(500).send("Error saving to database");
//     }
// });

router.post("/", userController.create);

export default router;