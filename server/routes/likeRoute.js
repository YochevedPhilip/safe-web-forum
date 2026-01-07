import { Router } from "express";
import { likeController } from "../controllers/likeController.js";

const likeRouter = Router();

// Like
likeRouter.post("/posts/:postId/likes", likeController.likePost);

// Unlike
likeRouter.delete("/posts/:postId/likes", likeController.unlikePost);

export default likeRouter;
