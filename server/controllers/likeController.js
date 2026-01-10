import { likeService } from "../services/likeService.js";
import { AppError } from "../errors/appError.js";

export const likeController = {
  async like(req, res, next) {
    try {
      const { targetType, targetId } = req.params;
      const userId = req.user.userId;
      if (!userId) throw new AppError("Unauthorized", 401);

      const result = await likeService.like(userId, targetType, targetId);
      res.status(200).json(result); // { liked: true }
    } catch (err) {
      next(err);
    }
  },

  async unlike(req, res, next) {
    try {
      const { targetType, targetId } = req.params;
      const userId = req.user.userId;
      if (!userId) throw new AppError("Unauthorized", 401);

      const result = await likeService.unlike(userId, targetType, targetId);
      res.status(200).json(result); // { liked: false }
    } catch (err) {
      next(err);
    }
  },
};
