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
