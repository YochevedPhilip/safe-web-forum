import { postService } from '../services/postService.js';

export const postController = {
    async getPostsByTopic(req, res, next) {
        try {
            const { topicId } = req.params;
            const { page, limit } = req.query;

            const posts = await postService.getPostsByTopic(topicId, { page, limit });
            const items = posts.map(p => ({
                id: p._id,
                title: p.title,
                content: p.content,
                author: p.publisherId?.username ?? "Anonymous",
                date: p.publishedAt ?? p.createdAt,
                likes: p.stats?.likeCount ?? 0,
                comments: p.stats?.commentCount ?? 0,
            }));
            res.status(200).json(items);
        } catch (err) {
            next(err);
        }
    },

      async getAllPosts(req, res, next) {
    try {
      const { page, limit } = req.query;

      const posts = await postService.getAllPosts({ page, limit });

      const items = posts.map(p => ({
        id: p._id,
        title: p.title,
        content: p.content,
        author: p.publisherId?.username ?? "Anonymous",
        date: p.publishedAt ?? p.createdAt,
        likes: p.stats?.likeCount ?? 0,
        comments: p.stats?.commentCount ?? 0,
      }));

      res.status(200).json(items);
    } catch (err) {
      next(err);
    }
  }

};