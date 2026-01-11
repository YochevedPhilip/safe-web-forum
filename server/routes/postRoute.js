import {Router} from 'express';
import {postController} from '../controllers/postController.js';

const postRouter = Router();

postRouter.get('/topics/:topicId/posts', postController.getPostsByTopic);
postRouter.get("/", postController.getAllPosts);
postRouter.get("/:postId", postController.getPostPage);

export default postRouter;
