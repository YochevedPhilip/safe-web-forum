import { Router } from "express";
import { postController } from "../controllers/postController.js";

const postRouter = Router();

// GET
postRouter.get("/", postController.getAllPosts); // כל הפוסטים
postRouter.get("/topics/:topicId/posts", postController.getPostsByTopic); // פוסטים לפי נושא

// POST
 postRouter.post("/", postController.createPost);

export default postRouter;
