import Post from "../data/postModel.js";

export const createPost = async (data) => {
  const newPost = new Post(data);
  return await newPost.save();
};

export const getPosts = async (filter = {}) => {
  return await Post.find(filter).sort({ createdAt: -1 });
};

export const getPostById = async (id) => {
  return await Post.findById(id);
};

export const updatePostByOwner = async (postId, publisherId, updateData) => {
  return await Post.findOneAndUpdate(
    { _id: postId, publisherId, deletedAt: null },
    updateData,
    { new: true, runValidators: true }
  );
};

export const deletePostByOwner = async (postId, publisherId) => {
  return await Post.findOneAndUpdate(
    { _id: postId, publisherId, deletedAt: null },
    { deletedAt: new Date() },
    { new: true }
  );
};

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
  },
  async findById(postId) {
    return Post.findOne({
      _id: postId,
      deletedAt: null,
      blockedAt: null,
      publishedAt: { $ne: null },
    })
      .populate("publisherId", "username")
      .lean();
  },


};
