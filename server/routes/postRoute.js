import { Router } from "express";
import { postController } from "../controllers/postController.js";
import { requireAuth } from "../middlewares/authMiddleware.js"; 

const postRouter = Router();

// GET
postRouter.get("/", postController.getAllPosts); 
postRouter.get("/topics/:topicId/posts", requireAuth, postController.getPostsByTopic); 
postRouter.get("/:postId", requireAuth, postController.getPostPage);

// POST
postRouter.post("/", requireAuth, postController.createPost);

postRouter.put("/:postId", requireAuth, postController.editPost);
postRouter.delete("/:postId", requireAuth, postController.deletePost);

export default postRouter;