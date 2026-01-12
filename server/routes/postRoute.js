import { Router } from "express";
import { postController } from "../controllers/postController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const postRouter = Router();

// GET0
postRouter.get("/", postController.getAllPosts); 
postRouter.get("/topics/:topicId/posts",requireAuth, postController.getPostsByTopic); 
postRouter.get("/:postId",requireAuth, postController.getPostById);

// POST
 postRouter.post("/",requireAuth, postController.createPost);

export default postRouter;
