import {postRepository} from '../repositories/postRepository.js';
import {topicRepository} from '../repositories/topicRepository.js';
import mongoose from 'mongoose';
import { AppError } from "../errors/appError.js";


export const postService = {
    async getPostsByTopic(topicId , { page = 1, limit = 10 } = {}) {
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

        return await postRepository.findByTopicId(topicId, safeLimit, skip);

    },

      async getAllPosts({ page = 1, limit = 10 } = {}) {
    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const skip = (safePage - 1) * safeLimit;

    return await postRepository.findAllSortedByCreatedAt(safeLimit, skip);
  }

};