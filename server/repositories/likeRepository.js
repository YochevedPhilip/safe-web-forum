import Like from "../data/likeModel.js";

export const likeRepository = {
  
createLike({ userId, targetType, targetId }) {
  return Like.updateOne(
    { userId, targetType, targetId },
    { $setOnInsert: { userId, targetType, targetId } },
    { upsert: true }
  );
},


 
  deleteLike({userId, targetType, targetId}) {
    return Like.deleteOne({
      userId,
      targetType,
      targetId,
    });
  },

 findByUserAndTargets(userId, targetType, targetIds) {
    return Like.find({
      userId,
      targetType,
      targetId: { $in: targetIds },
    })
      .select({ targetId: 1, _id: 0 })
      .lean();
  },
 

};
