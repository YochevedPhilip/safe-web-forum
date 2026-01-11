import { Router } from "express";
import { postController } from "../controllers/postController.js";

const postRouter = Router();

// GET
postRouter.get("/", postController.getAllPosts); 
postRouter.get("/topics/:topicId/posts", postController.getPostsByTopic); 
postRouter.get("/:postId", postController.getPostPage);
// POST
 postRouter.post("/", postController.createPost);

export default postRouter;
