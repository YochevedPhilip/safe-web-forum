// import mongoose from "mongoose";
// import Comment from "../data/commentModel.js";
// import Post from "../data/postModel.js";
// import { checkPostContent } from "../services/aiModeration.js";

// export const commentController = {
//   async createComment(req, res) {
//     const { postId, content } = req.body;
//     const publisherId = req.body.publisherId;//req.user?.id; // <-- from auth middleware

//     if (!mongoose.isValidObjectId(postId)) {
//       return res.status(400).json({ message: "Invalid postId" });
//     }
//     if (!publisherId || !mongoose.isValidObjectId(publisherId)) {
//       return res.status(401).json({ message: "Not logged in" });
//     }
//     if (!content || !content.trim()) {
//       return res.status(400).json({ message: "Content is required" });
//     }

//     const aiResult = await checkPostContent("comment", content);
//   if (!aiResult.safeToPublish) {
//     return res.status(403).json({
//       messageToUser: aiResult.messageToUser,
//       riskLevel: aiResult.riskLevel,
//       categories: aiResult.categories,
//     });
//   }

//     // ensure post is publishable/commentable
//     const post = await Post.findOne({
//       _id: postId,
//       deletedAt: null,
//       blockedAt: null,
//       publishedAt: { $ne: null },
//     });

//     if (!post) return res.status(404).json({ message: "Post not found" });

//     const comment = await Comment.create({
//       postId,
//       publisherId,
//       content: content.trim(),
//       parentCommentId: null,
//       publishedAt: new Date(), // publish immediately
//     });

//     // update stats (optional but good)
//     await Post.updateOne(
//       { _id: postId },
//       { $inc: { "stats.commentCount": 1 } }
//     );

//     return res.status(201).json({ comment });
//   },
// };

import Comment from "../data/commentModel.js";
import { checkPostContent } from "../services/aiModeration.js";

export const commentController = {
  createComment: async (req, res) => {
    try {
      const { postId, content } = req.body;

      if (!postId || !content?.trim()) {
        return res.status(400).json({ message: "postId and content are required" });
      }

      // אותו מנגנון כמו פוסטים:
      const moderation = await checkPostContent("comment", content);

      if (!moderation.safeToPublish) {
        return res.status(403).json(moderation);
      }

      const publisherId = req.user?._id || req.body.publisherId; // fallback זמני

      const comment = await Comment.create({
        postId,
        publisherId,
        content,
      });

      // נחזיר את התגובה עם publisherId populated כדי שה-UI יראה username
      const populated = await Comment.findById(comment._id).populate("publisherId", "username");
      return res.status(201).json(populated);
    } catch (err) {
      console.error("createComment error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getCommentsByPost: async (req, res) => {
    try {
      const { postId } = req.params;

      const comments = await Comment.find({ postId })
        .sort({ createdAt: -1 })
        .populate("publisherId", "username");

      return res.json(comments);
    } catch (err) {
      console.error("getCommentsByPost error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

// export default commentController;
