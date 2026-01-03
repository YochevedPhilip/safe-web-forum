import * as postRepo from "../repositories/postRepository.js";

export const createPost = async (req, res) => {
  try {
    const { publisherId, topicId, content, title } = req.body;

    if (!title || title.length < 3) return res.status(400).json({ error: "Title is too short" });
    if (!content || content.length < 10) return res.status(400).json({ error: "Content is too short" });

    const post = await postRepo.createPost({
      publisherId,
      topicId,
      content,
      title,
      publishedAt: new Date(),
      moderation: { status: "OK" },
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { topicId, publisherId } = req.query;
    const filter = { deletedAt: null, blockedAt: null };
    if (topicId) filter.topicId = topicId;
    if (publisherId) filter.publisherId = publisherId;

    const posts = await postRepo.getPosts(filter);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await postRepo.getPostById(req.params.id);
    if (!post || post.deletedAt) return res.status(404).json({ error: "Post not found" });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const updatedPost = await postRepo.updatePost(req.params.id, req.body);
    if (!updatedPost) return res.status(404).json({ error: "Post not found" });

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const deletedPost = await postRepo.deletePost(req.params.id);
    if (!deletedPost) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ message: "Post deleted successfully", id: deletedPost._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const moderatePost = async (req, res) => {
  try {
    const post = await postRepo.moderatePost(req.params.id, req.body);
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
