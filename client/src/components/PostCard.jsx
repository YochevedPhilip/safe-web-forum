import PropTypes from "prop-types";
import LikeButton from "./likeButton.jsx";

export default function PostCard({ post, onOpen, onToggleLike }) {
  const postId = String(post.id ?? post._id);

  return (
    <div
      className="post-card" 
      onClick={() => onOpen(postId)}
    >
      <div className="post-header">
        <h3 className="post-title">{post.title}</h3>
      </div>

      <p className="post-content">{post.content}</p>

      <div style={{ marginBottom: '10px' }}>
        <small className="post-author">
          Published by {post.author ?? "Anonymous"} ·{" "}
          {post.date ? new Date(post.date).toLocaleDateString('en-US') : ""}
        </small>
      </div>
      <div className="post-footer">
        <div style={{ display: "flex", gap: "20px" }}>
          <LikeButton
            postId={String(post.id ?? post._id)}
            liked={post._localLiked}
            likes={post.likes}
            onChange={({ liked, likes }) => onToggleLike(post, liked, likes)}
          />

          <div className="like-section" style={{ cursor: 'default' }}>
            <span style={{ fontSize: '1.1rem' }}>💬</span>
            <span style={{ marginRight: '5px' }}>{post.comments ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

PostCard.propTypes = {
  onOpen: PropTypes.func.isRequired,
  onToggleLike: PropTypes.func.isRequired,
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    content: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    _localLiked: PropTypes.bool,
    likes: PropTypes.number,
    comments: PropTypes.number,
  }).isRequired,
};
