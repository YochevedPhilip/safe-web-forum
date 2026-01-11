import {Router} from 'express';
import {commentController} from '../controllers/commentController.js';

const commentRouter = Router();

commentRouter.post("/", commentController.createComment);

export default commentRouter;
