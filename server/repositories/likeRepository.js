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

 
 

};
