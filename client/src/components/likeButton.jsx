import PropTypes from "prop-types";
import { likesService } from "../services/likesService";

export default function LikeButton({ postId, liked, likes, onChange, onError }) {
  const handleClick = async (e) => {
    e?.stopPropagation?.();

    const wasLiked = Boolean(liked);

    onChange?.({
      liked: !wasLiked,
      likes: Math.max(0, (likes ?? 0) + (wasLiked ? -1 : 1)),
    });

    try {
      if (wasLiked) await likesService.unlikePost(postId);
      else await likesService.likePost(postId);
    } catch (err) {
      onChange?.({
        liked: wasLiked,
        likes: Math.max(0, (likes ?? 0) + (wasLiked ? 1 : -1)),
      });
      onError?.(err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0 }}
      aria-label="Toggle like"
    >
      <span style={{ fontSize: "1.2rem" }}>{liked ? "❤️" : "🤍"}</span>
      <span style={{ marginRight: 6 }}>{likes ?? 0}</span>
    </button>
  );
}

LikeButton.propTypes = {
  postId: PropTypes.string.isRequired,
  liked: PropTypes.bool,
  likes: PropTypes.number,
  onChange: PropTypes.func.isRequired, 
  onError: PropTypes.func,
};
