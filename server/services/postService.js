import {topicRepository} from '../repositories/topicRepository.js';
import { likeRepository } from "../repositories/likeRepository.js";
import { checkPostContent } from './aiModeration.js';
import { postRepository, updatePostByOwner, deletePostByOwner } from '../repositories/postRepository.js';


import mongoose from 'mongoose';
import { AppError } from "../errors/appError.js";


export const postService = {
    async getPostsByTopic(topicId , { page = 1, limit = 10, userId } = {}) {
      console.log("userId in getPostsByTopic:", userId);

        console.log("topicId:", topicId, topicId.length);
            
        if (!topicId) {
            throw new AppError("topicId is required", 400);
        }

        if (!mongoose.Types.ObjectId.isValid(topicId)) {
            throw new AppError("Invalid topicId", 400);
        }

        const topicExists = await topicRepository.existsById(topicId);

        if (!topicExists) {
            throw new AppError("Topic not found", 404);
        }
        const safePage = Math.max(Number(page) || 1, 1);
        const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
        const skip = (safePage - 1) * safeLimit;

    const posts = await postRepository.findByTopicId(
      topicId,
      safeLimit,
      skip
    );

    if (!userId) {
      return posts.map((p) => ({
        ...p,
        likedByMe: false,
      }));
    }

    const likes = await likeRepository.findByUserAndTargets(
      userId,
      "post",
      posts.map((p) => p._id)
    );

    const likedPostIds = new Set(
      likes.map((l) => String(l.targetId))
    );

    return posts.map((p) => ({
      ...p,
      likedByMe: likedPostIds.has(String(p._id)),
    }));
  },


    async getAllPosts({ page = 1, limit = 10 } = {}) {
    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const skip = (safePage - 1) * safeLimit;

    return await postRepository.findAllSortedByCreatedAt(safeLimit, skip);
    
  }, 

    async editPost(postId, userId, { title, content }) {
    if (!userId) throw new AppError("Unauthorized", 401);

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      throw new AppError("Invalid postId", 400);
    }

    if (title === undefined && content === undefined) {
      throw new AppError("Nothing to update", 400);
    }

    const ai = await checkPostContent(title || "", content || "");
    if (!ai.safeToPublish) {
      throw new AppError(ai.messageToUser, 422);
    }

    const updated = await updatePostByOwner(postId, userId, { title, content });

    if (!updated) {
      throw new AppError("Post not found or not owned by user", 403);
    }

    return { post: updated, aiMessage: ai.messageToUser };
  },

  async deletePost(postId, userId) {
    if (!userId) throw new AppError("Unauthorized", 401);

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      throw new AppError("Invalid postId", 400);
    }

    const deleted = await deletePostByOwner(postId, userId);

    if (!deleted) {
      throw new AppError("Post not found or not owned by user", 403);
    }

    return; 
  },


};