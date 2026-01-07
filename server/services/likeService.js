import mongoose from "mongoose";
import { AppError } from "../errors/appError.js";
import { likeRepository } from "../repositories/likeRepository.js";
import Post from "../data/postModel.js";

function isDuplicateKey(err) {
  return err?.code === 11000;
}

export const likeService = {
  /**
   * Like לפוסט
   * - אם כבר יש Like: לא מעלה count (אידמפוטנטי) ומחזיר liked:true
   */
  async likePost(postId, userId) {
    if (!postId) throw new AppError("postId is required", 400);
    if (!userId) throw new AppError("userId is required", 401);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new AppError("Invalid postId", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid userId", 400);
    }

    // (אופציונלי) בדיקה שהפוסט קיים ולא מחוק/חסום/לא פורסם
    const post = await Post.findOne({
      _id: postId,
      publishedAt: { $ne: null },
      blockedAt: null,
      deletedAt: null,
    }).select({ _id: 1 }).lean();

    if (!post) throw new AppError("Post not found", 404);

    try {
      await likeRepository.createPostLike(userId, postId);

      // מעדכנים ספירת לייקים על הפוסט בלי לגעת ב-postRepository
      await Post.updateOne(
        { _id: postId },
        { $inc: { "stats.likeCount": 1 } }
      );

      return { liked: true };
    } catch (err) {
      // אם כבר קיים Like - לא עושים inc נוסף
      if (isDuplicateKey(err)) {
        return { liked: true };
      }
      throw err;
    }
  },

  /**
   * Unlike לפוסט
   * - מוריד count רק אם באמת נמחק Like
   * - אם לא היה Like: לא עושה כלום (אידמפוטנטי) ומחזיר liked:false
   */
  async unlikePost(postId, userId) {
    if (!postId) throw new AppError("postId is required", 400);
    if (!userId) throw new AppError("userId is required", 401);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new AppError("Invalid postId", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid userId", 400);
    }

    const res = await likeRepository.deletePostLike(userId, postId);

    if (res.deletedCount === 1) {
      // מורידים בבטחה כדי לא לרדת מתחת ל-0
      await Post.updateOne(
        { _id: postId, "stats.likeCount": { $gt: 0 } },
        { $inc: { "stats.likeCount": -1 } }
      );
    }

    return { liked: false };
  },
};
