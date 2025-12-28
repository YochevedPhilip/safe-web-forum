import mongoose from "mongoose";

const TARGET_TYPES = ["post", "comment"];


const LikeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    targetType: {
      type: String,
      enum: TARGET_TYPES,
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

LikeSchema.index(
  { userId: 1, targetType: 1, targetId: 1 },
  { unique: true }
);

LikeSchema.index({ userId: 1, createdAt: -1 });

const Like = mongoose.models.Like || mongoose.model("Like", LikeSchema);
export default Like;
