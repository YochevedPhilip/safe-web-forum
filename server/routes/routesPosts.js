import express from "express";
import Post from "../data/postModel.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { publisherId, topicId, content } = req.body;

    const newPost = new Post({
      publisherId,
      topicId,
      content,
      publishedAt: new Date(),
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
