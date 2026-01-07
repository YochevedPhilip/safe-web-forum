import Like from "../data/likeModel.js";

export const likeRepository = {
  
  createPostLike(userId, postId) {
    const like = new Like({
      userId,
      targetType: "post",
      targetId: postId,
    });

    return like.save(); // Promise
  },

 
  deletePostLike(userId, postId) {
    return Like.deleteOne({
      userId,
      targetType: "post",
      targetId: postId,
    });
  },

 
  async existsPostLike(userId, postId) {
    const doc = await Like.findOne({
      userId,
      targetType: "post",
      targetId: postId,
    })
      .select({ _id: 1 })
      .lean();

    return !!doc;
  },


  async findUserLikesForPosts(userId, postIds) {
    const likes = await Like.find({
      userId,
      targetType: "post",
      targetId: { $in: postIds },
    })
      .select({ targetId: 1, _id: 0 })
      .lean();

    return new Set(likes.map((l) => String(l.targetId)));
  },
};
