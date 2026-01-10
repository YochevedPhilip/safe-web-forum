import { Router } from "express";
import { postController } from "../controllers/postController.js";
//import { optionalAuth } from "../middlewares/authMiddleware.js";

const postRouter = Router();

// GET
postRouter.get("/", postController.getAllPosts); 
postRouter.get("/topics/:topicId/posts", postController.getPostsByTopic); 
// POST
 postRouter.post("/", postController.createPost);

export default postRouter;
