import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 80 },

    normalizedTitle: { 
      type: String, 
      required: true, 
      lowercase: true, 
      trim: true },

    createdByUserId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      default: null },

    isActive: { 
      type: Boolean, 
      default: true },
  },
  { timestamps: true }
);

TopicSchema.index({ normalizedTitle: 1 }, { unique: true });

TopicSchema.index({ title: 1 });

const Topic = mongoose.models.Topic || mongoose.model("Topic", TopicSchema);
export default Topic;
