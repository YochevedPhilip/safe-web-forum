import { postService } from '../services/postService.js';
import Post from "../data/postModel.js";
import Comment from "../data/commentModel.js";
import mongoose from "mongoose";

export const postController = {
    async getPostsByTopic(req, res, next) {
        try {
            const { topicId } = req.params;
            const { page, limit } = req.query;

            const posts = await postService.getPostsByTopic(topicId, { page, limit });
            const items = posts.map(p => ({
                id: p._id,
                title: p.title,
                content: p.content,
                author: p.publisherId?.username ?? "Anonymous",
                date: p.publishedAt ?? p.createdAt,
                likes: p.stats?.likeCount ?? 0,
                comments: p.stats?.commentCount ?? 0,
            }));
            res.status(200).json(items);
        } catch (err) {
            next(err);
        }
    },

      async getAllPosts(req, res, next) {
    try {
      const { page, limit } = req.query;

      const posts = await postService.getAllPosts({ page, limit });

      const items = posts.map(p => ({
        id: p._id,
        title: p.title,
        content: p.content,
        author: p.publisherId?.username ?? "Anonymous",
        date: p.publishedAt ?? p.createdAt,
        likes: p.stats?.likeCount ?? 0,
        comments: p.stats?.commentCount ?? 0,
      }));

      res.status(200).json(items);
    } catch (err) {
      next(err);
    }
  },

  async getPostPage(req, res) {
    const { postId } = req.params;
    const limit = Math.min(Number(req.query.limit || 10), 50);

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    const post = await Post.findOne({
      _id: postId,
      deletedAt: null,
      blockedAt: null,
      publishedAt: { $ne: null },
    }).populate("publisherId", "username");

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comments = await Comment.find({
      postId,
      parentCommentId: null,
      deletedAt: null,
      blockedAt: null,
      publishedAt: { $ne: null },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("publisherId", "username");

    return res.json({ post, comments });
  },

};