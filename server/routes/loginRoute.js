import express from 'express';

const router = express.Router();

router.post("/", (req, res) => {
  console.log("register button pressed");
  res.send("button pressed")
})

export default router;