import mongoose from "mongoose";

import Comment from "../data/commentModel.js";

export const commentRepository = {


async findTopLevelByPostId(postId, limit = 10) {
  if (!mongoose.isValidObjectId(postId)) {
    throw new TypeError("Invalid postId");
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

  return Comment.find({
    postId,
    parentId: null,
  })
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .lean();
}
};
