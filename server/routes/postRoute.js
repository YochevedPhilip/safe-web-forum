import { Router } from 'express';
import { postController } from '../controllers/postController.js';
import { requireAuth } from '../middleware/authMiddleware.js'; // וודא שהנתיב נכון

const postRouter = Router();

// שליפה (כבר יש לך)
postRouter.get('/topics/:topicId/posts', postController.getPostsByTopic);
postRouter.get("/", postController.getAllPosts);
postRouter.get("/:postId", postController.getPostPage);

// יצירה - הוסף את השורה הזו!
postRouter.post("/", requireAuth, postController.createPost);

export default postRouter;