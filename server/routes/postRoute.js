import { Router } from "express";
import { postController } from "../controllers/postController.js";
import { requireAuth } from "../middlewares/authMiddleware.js"; // שים לב לנתיב הנכון אצלך (middlewares או middleware)

const postRouter = Router();

// GET
postRouter.get("/", postController.getAllPosts); 
postRouter.get("/topics/:topicId/posts", requireAuth, postController.getPostsByTopic); 
postRouter.get("/:postId", postController.getPostPage);

// POST
postRouter.post("/", requireAuth, postController.createPost);

export default postRouter;