import * as postRepo from "../repositories/postRepository.js";
import { checkPostContent } from "../services/aiModeration.js";
import { postService } from "../services/postService.js";
import Post from "../data/postModel.js";
import Comment from "../data/commentModel.js";
import mongoose from "mongoose";

export const postController = {
  // ========= CREATE POST (עם הגנת AI והתאמה ל-Schema) =========
  async createPost(req, res) {
    try {
      const { topicId, content, title, anonymous } = req.body;
      const publisherId = req.user?.userId;

      // ולידציה בסיסית
      if (!title || title.length < 3)
        return res.status(400).json({ error: "Title is too short" });
      if (!content || content.length < 10)
        return res.status(400).json({ error: "Content is too short" });
      if (!topicId)
        return res.status(400).json({ error: "Topic ID is required" });

      // 1. בדיקה מול שירות ה-AI
      const aiResult = await checkPostContent(title, content);
      console.log("AI Analysis Result:", aiResult);

      // 2. טיפול בסיכון גבוה (HIGH) - חסימה
      if (aiResult.riskLevel === "HIGH") {
        return res.status(403).json({
          messageToUser: aiResult.messageToUser,
          riskLevel: "HIGH",
          categories: aiResult.categories,
        });
      }

      // 3. מיפוי רמת הסיכון לסטטוסים של ה-Schema שלך
      // MEDIUM -> SENSITIVE (למשל 'אני עצוב')
      // LOW -> OK
      const modStatus = aiResult.riskLevel === "MEDIUM" ? "SENSITIVE" : "OK";
      
      // 4. יצירת הפוסט ב-Repository
      const postData = {
        publisherId,
        topicId,
        title,
        content,
        anonymous: !!anonymous,
        publishedAt: new Date(),
        moderation: {
          status: modStatus,
          helpFlag: aiResult.riskLevel === "MEDIUM", // סימון לעזרה בפוסטים עצובים
          evaluatedAt: new Date(),
          reasons: Array.isArray(aiResult.categories) ? aiResult.categories : []
        }
      };

      const post = await postRepo.createPost(postData);
      console.log("Post saved successfully with status:", modStatus);

// במקום res.status(201).json(post);
// נחזיר גם את הנתונים וגם את הודעת ה-AI
return res.status(201).json({
  ...post.toObject(),
  aiMessage: aiResult.messageToUser 
});
    } catch (err) {
      console.error("Critical Error in createPost:", err);
      // החזרת הודעה מפורטת יותר במקרה של שגיאת Mongoose (כדי למנוע 500 גנרי)
      res.status(500).json({ 
        error: "Internal Server Error", 
        message: err.message 
      });
    }
  },

  // ========= GET POSTS BY TOPIC (עם תמיכה בלייקים ומשתמש מחובר) =========
  async getPostsByTopic(req, res, next) {
    try {
      const { topicId } = req.params;
      const { page, limit } = req.query;
      const userId = req.user?.userId;

      // קריאה לשירות שמביא את הפוסטים (כולל בדיקה אם המשתמש עשה לייק)
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

  // ========= GET ALL POSTS (פיד כללי) =========
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

  // ========= GET SINGLE POST PAGE (כולל תגובות) =========
  async getPostPage(req, res) {
    try {
      const { postId } = req.params;
      const limit = Math.min(Number(req.query.limit || 10), 50);

      if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ message: "Invalid postId" });
      }

      // שליפת הפוסט ומוודאים שהוא לא מחוק או חסום ברמת HARMFUL קשה
      const post = await Post.findOne({
        _id: postId,
        deletedAt: null,
        blockedAt: null,
      }).populate("publisherId", "username");

      if (!post) return res.status(404).json({ message: "Post not found" });

      // שליפת תגובות ברמה הראשונה
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
};