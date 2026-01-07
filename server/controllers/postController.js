import * as postRepo from "../repositories/postRepository.js";
import { checkPostContent } from "../services/services/aiModeration.js";
export const createPost = async (req, res) => {
  try {
    const { publisherId, topicId, content, title, anonymous } = req.body; 

    if (!title || title.length < 3)
      return res.status(400).json({ error: "Title is too short" });
    if (!content || content.length < 10)
      return res.status(400).json({ error: "Content is too short" });
    const aiResult = await checkPostContent(title, content);
    if (!aiResult.safeToPublish) {
      return res.status(403).json({
        messageToUser: aiResult.messageToUser,
        riskLevel: aiResult.riskLevel,
        categories: aiResult.categories,
      });
    }
    
    
    

    const post = await postRepo.createPost({
      publisherId,
      topicId,
      content,
      title,
      anonymous: !!anonymous, 
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
    const posts = await postRepo.getPosts();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
