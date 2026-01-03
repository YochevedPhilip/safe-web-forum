import Post from "../data/postModel.js";

/**
 * CREATE POST
 */
export const createPost = async (req, res) => {
  console.log("BODY RECEIVED:", req.body); // <--- הוסיפי
  try {
    const { publisherId, topicId, content, title } = req.body;
    if (!title || title.length < 3) {
      return res.status(400).json({ error: "Title is too short" });
    }

    if (!content || content.length < 10) {
      return res.status(400).json({ error: "Content is too short" });
    }

    const newPost = new Post({
      publisherId,
      topicId,
      content,
      title,
      publishedAt: new Date(),
      moderation: { status: 'OK' }
    });

  const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err); // חשוב להדפיס את השגיאה
    res.status(500).json({ error: err.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { topicId, publisherId } = req.query;
    let filter = { deletedAt: null, blockedAt: null };

    if (topicId) filter.topicId = topicId;
    if (publisherId) filter.publisherId = publisherId;

    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post || post.deletedAt) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, moderation, adminNote } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { content, moderation, adminNote },
      { new: true, runValidators: true }
    );

    if (!updatedPost) return res.status(404).json({ error: "Post not found" });

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deletedPost) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ message: "Post deleted successfully", id: deletedPost._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const moderatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reasons, helpFlag } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.moderation.status = status || post.moderation.status;
    post.moderation.reasons = reasons || post.moderation.reasons;
    post.moderation.helpFlag = helpFlag ?? post.moderation.helpFlag;
    post.moderation.evaluatedAt = new Date();

    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
