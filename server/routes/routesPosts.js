import express from "express";
import { createPostController, getPostsController } from "../controllers/postController.js";

const router = express.Router();

router.post("/", createPostController);
router.get("/", getPostsController);

export default router;
