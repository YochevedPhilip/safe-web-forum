import express from "express";
import { likeController } from "../controllers/likeController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:targetType/:targetId", requireAuth, likeController.like);
router.delete("/:targetType/:targetId", requireAuth, likeController.unlike);

export default router;
