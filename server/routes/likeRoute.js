import express from "express";
import { likeController } from "../controllers/likeController.js";

const router = express.Router();

router.post("/:targetType/:targetId", likeController.like);
router.delete("/:targetType/:targetId", likeController.unlike);

export default router;
