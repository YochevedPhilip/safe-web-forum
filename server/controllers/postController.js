import * as postRepo from "../repositories/postRepository.js";
import { checkPostContent } from "../services/aiModeration.js";
import { postService } from "../services/postService.js"; // אם צריך פונקציות נוספות

export const postController = {
  async createPost(req, res) {
    try {
      const {  topicId, content, title, anonymous } = req.body;
      const publisherId = req.user?.userId;

      if (!title || title.length < 3)
        return res.status(400).json({ error: "Title is too short" });
      if (!content || content.length < 10)
        return res.status(400).json({ error: "Content is too short" });

      // בדיקה מול AI
      const aiResult = await checkPostContent(title, content);
      if (!aiResult.safeToPublish) {
        return res.status(403).json({
          messageToUser: aiResult.messageToUser,
          riskLevel: aiResult.riskLevel,
          categories: aiResult.categories,
        });
      }

      const post = await postRepo.createPost({
        publisherId,
        topicId,
        content,
        title,
        anonymous: !!anonymous,
        publishedAt: new Date(),
        moderation: { status: "OK" },
      });

      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ========= GET POSTS BY TOPIC =========
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
        author: p.publisherId?.username ?? "Anonymous",
        date: p.publishedAt ?? p.createdAt,
        likes: p.stats?.likeCount ?? 0,
        comments: p.stats?.commentCount ?? 0,
        likedByMe: Boolean(p.likedByMe),
       


      }));
      console.log("first item likedByMe:", items[0]?.likedByMe);


      res.status(200).json(items);
    } catch (err) {
      next(err);
    }
  },

  // ========= GET ALL POSTS =========
  async getAllPosts(req, res, next) {
    try {
      const { page, limit } = req.query;

      const posts = await postService.getAllPosts({ page, limit });
      const items = posts.map((p) => ({
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
};
