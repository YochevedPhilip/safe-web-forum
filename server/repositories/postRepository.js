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

export const updatePost = async (id, updateData) => {
  return await Post.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deletePost = async (id) => {
  return await Post.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
};

export const moderatePost = async (id, moderationData) => {
  const post = await Post.findById(id);
  if (!post) return null;

  post.moderation.status = moderationData.status || post.moderation.status;
  post.moderation.reasons = moderationData.reasons || post.moderation.reasons;
  post.moderation.helpFlag = moderationData.helpFlag ?? post.moderation.helpFlag;
  post.moderation.evaluatedAt = new Date();

  return await post.save();
};
