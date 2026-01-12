import * as postRepo from "../repositories/postRepository.js";
import { checkPostContent } from "../services/aiModeration.js";
import { postService } from "../services/postService.js";
import Post from "../data/postModel.js";
import Comment from "../data/commentModel.js";
import mongoose from "mongoose";

export const postController = {
  async createPost(req, res) {
    try {
      const { topicId, content, title, anonymous } = req.body;
      const publisherId = req.user?.userId;

      if (!title || title.length < 3)
        return res.status(400).json({ error: "Title is too short" });
      if (!content || content.length < 10)
        return res.status(400).json({ error: "Content is too short" });
      if (!topicId)
        return res.status(400).json({ error: "Topic ID is required" });

      const aiResult = await checkPostContent(title, content);
      console.log("AI Analysis Result:", aiResult);

      if (aiResult.riskLevel === "HIGH") {
        return res.status(403).json({
          messageToUser: aiResult.messageToUser,
          riskLevel: "HIGH",
          categories: aiResult.categories,
        });
      }

      const modStatus = aiResult.riskLevel === "MEDIUM" ? "SENSITIVE" : "OK";
      
      const postData = {
        publisherId,
        topicId,
        title,
        content,
        anonymous: !!anonymous,
        publishedAt: new Date(),
        moderation: {
          status: modStatus,
          helpFlag: aiResult.riskLevel === "MEDIUM", 
          evaluatedAt: new Date(),
          reasons: Array.isArray(aiResult.categories) ? aiResult.categories : []
        }
      };

      const post = await postRepo.createPost(postData);
      console.log("Post saved successfully with status:", modStatus);


return res.status(201).json({
  ...post.toObject(),
  aiMessage: aiResult.messageToUser 
});
    } catch (err) {
      console.error("Critical Error in createPost:", err);
      res.status(500).json({ 
        error: "Internal Server Error", 
        message: err.message 
      });
    }
  },

  async getPostsByTopic(req, res, next) {
    try {
      const { topicId } = req.params;
      const { page, limit } = req.query;
      const userId = req.user?.userId;

      const posts = await postService.getPostsByTopic(topicId, { page, limit, userId });
      
      const items = posts.map((p) => ({
        id: p._id,
        title: p.title,
        content: p.content,
        author: p.anonymous ? "Anonymous" : (p.publisherId?.username ?? "User"),
        date: p.publishedAt ?? p.createdAt,
        likes: p.stats?.likeCount ?? 0,
        comments: p.stats?.commentCount ?? 0,
        likedByMe: Boolean(p.likedByMe),
        moderationStatus: p.moderation?.status
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
      const items = posts.map((p) => ({
        id: p._id,
        title: p.title,
        content: p.content,
        author: p.anonymous ? "Anonymous" : (p.publisherId?.username ?? "User"),
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
    try {
      const { postId } = req.params;
      const limit = Math.min(Number(req.query.limit || 10), 50);

      if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ message: "Invalid postId" });
      }

      const post = await Post.findOne({
        _id: postId,
        deletedAt: null,
        blockedAt: null,
      }).populate("publisherId", "username");

      if (!post) return res.status(404).json({ message: "Post not found" });

      const comments = await Comment.find({
        postId,
        parentCommentId: null,
        deletedAt: null,
        blockedAt: null,
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("publisherId", "username");

      return res.json({ post, comments });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

    async editPost(req, res, next) {
    try {
      const { postId } = req.params;
      const userId = req.user?.userId;

      const { title, content } = req.body;

      const result = await postService.editPost(postId, userId, { title, content });

      // result = { post, aiMessage }
      return res.status(200).json({
        ...result.post,
        aiMessage: result.aiMessage,
      });
    } catch (err) {
      next(err);
    }
  },

  async deletePost(req, res, next) {
    try {
      const { postId } = req.params;
      const userId = req.user?.userId;

      await postService.deletePost(postId, userId);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

};