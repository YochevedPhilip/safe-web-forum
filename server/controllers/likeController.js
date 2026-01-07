import { likeService } from "../services/likeService.js";

export const likeController = {
  async likePost(req, res, next) {
    try {
      const { postId } = req.params;

      // מניח שיש לך auth middleware שממלא req.user
      const userId = req.user?._id  || "69568553da9fe30d410fbe7f";
      const result = await likeService.likePost(postId, userId);

      res.status(200).json(result); // { liked: true }
    } catch (err) {
      next(err);
    }
  },

  async unlikePost(req, res, next) {
    try {
      const { postId } = req.params;

      const userId = req.user?._id || "69568553da9fe30d410fbe7f";
      const result = await likeService.unlikePost(postId, userId);

      res.status(200).json(result); // { liked: false }
    } catch (err) {
      next(err);
    }
  },
};
