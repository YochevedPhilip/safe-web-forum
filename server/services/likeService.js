import mongoose from "mongoose";
import { AppError } from "../errors/appError.js";
import { likeRepository } from "../repositories/likeRepository.js";
import Post from "../data/postModel.js";
import Comment from "../data/commentModel.js"; 

const HANDLERS = {
  post: {
    Model: Post,
    existsQuery: (id) => ({
      _id: id,
      publishedAt: { $ne: null },
      blockedAt: null,
      deletedAt: null,
    }),
    likeCountPath: "stats.likeCount",
    notFoundMsg: "Post not found",
  },
  comment: {
    Model: Comment,
    existsQuery: (id) => ({
      _id: id,
      blockedAt: null,
      deletedAt: null,
    }),
    likeCountPath: "stats.likeCount",
    notFoundMsg: "Comment not found",
  },
};

function validateObjectId(id, name) {
  if (!id) throw new AppError(`${name} is required`, 400);
  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError(`Invalid ${name}`, 400);
}

export const likeService = {
  async like(userId, targetType, targetId) {
    validateObjectId(targetId, "targetId");
    validateObjectId(userId, "userId");
    if (!targetType) throw new AppError("targetType is required", 400);

    const h = HANDLERS[targetType];
    if (!h) throw new AppError("Invalid targetType", 400);

    const exists = await h.Model.findOne(h.existsQuery(targetId)).select({ _id: 1 }).lean();
    if (!exists) throw new AppError(h.notFoundMsg, 404);

    const res = await likeRepository.createLike({ userId, targetType, targetId });

    if (res?.upsertedCount === 1) {
      await h.Model.updateOne({ _id: targetId }, { $inc: { [h.likeCountPath]: 1 } });
    }

    return { liked: true };
  },

  async unlike(userId, targetType, targetId) {
  validateObjectId(targetId, "targetId");
  validateObjectId(userId, "userId");

  const h = HANDLERS[targetType];
  if (!h) throw new AppError("Invalid targetType", 400);

  const res = await likeRepository.deleteLike({
    userId,
    targetType,
    targetId,
  });

  if (res.deletedCount === 1) {
    await h.Model.updateOne(
      { _id: targetId, [h.likeCountPath]: { $gt: 0 } },
      { $inc: { [h.likeCountPath]: -1 } }
    );
  }

  return { liked: false };
}

};
