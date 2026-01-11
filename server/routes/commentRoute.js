import {Router} from 'express';
import {commentController} from '../controllers/commentController.js';

const commentRouter = Router();

commentRouter.post("/", commentController.createComment);
// commentRouter.get("/:postId", commentController.getCommentsByPost);

export default commentRouter;
