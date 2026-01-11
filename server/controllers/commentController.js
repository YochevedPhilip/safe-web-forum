import mongoose from "mongoose";
import Comment from "../data/commentModel.js";
import Post from "../data/postModel.js";

export const commentController = {
  async createComment(req, res) {
    const { postId, content } = req.body;
    const publisherId = req.body.publisherId;//req.user?.id; // <-- from auth middleware

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }
    if (!publisherId || !mongoose.isValidObjectId(publisherId)) {
      return res.status(401).json({ message: "Not logged in" });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    // ensure post is publishable/commentable
    const post = await Post.findOne({
      _id: postId,
      deletedAt: null,
      blockedAt: null,
      publishedAt: { $ne: null },
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      postId,
      publisherId,
      content: content.trim(),
      parentCommentId: null,
      publishedAt: new Date(), // publish immediately
    });

    // update stats (optional but good)
    await Post.updateOne(
      { _id: postId },
      { $inc: { "stats.commentCount": 1 } }
    );

    return res.status(201).json({ comment });
  },
};