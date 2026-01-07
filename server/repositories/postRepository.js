import Post from "../data/postModel.js";

export const postRepository = {
    
    findByTopicId(topicId, limit = 10, skip = 0) {
        return Post.find({ topicId, publishedAt: { $ne: null }, blockedAt: null, deletedAt: null })
            .sort({ publishedAt: -1 })
            .limit(limit)
            .skip(skip)
            .select("title content publishedAt createdAt stats publisherId") 
            .populate("publisherId", "username") 
            .lean();
    },

    findAllSortedByCreatedAt(limit = 10, skip = 0) {
    return Post.find({
      publishedAt: { $ne: null },
      blockedAt: null,
      deletedAt: null,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select("title content createdAt publishedAt stats publisherId")
      .populate("publisherId", "username")
      .lean();
  }

    
};



