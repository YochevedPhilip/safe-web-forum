import PropTypes from "prop-types";
import "../styles/global.css";
export default function PostCard({ post, onOpen, onToggleLike }) {
  const postId = String(post.id ?? post._id);

  return (
    <div
      className="post-card" // Uses the elegant styling from CSS
      onClick={() => onOpen(postId)}
    >
      <div className="post-header">
        <h3 className="post-title">{post.title}</h3>
      </div>

      {/* Post content */}
      <p className="post-content">{post.content}</p>

      {/* Author and date */}
      <div style={{ marginBottom: '10px' }}>
        <small className="post-author">
          Published by {post.author ?? "Anonymous"} ·{" "}
          {post.date ? new Date(post.date).toLocaleDateString('en-US') : ""}
        </small>
      </div>

      {/* Footer: likes and comments */}
      <div className="post-footer">
        <div style={{ display: "flex", gap: "20px" }}>
          <button
            type="button"
            className={`like-section ${post._localLiked ? 'liked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(post);
            }}
            style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0 }}
          >
            <span style={{ fontSize: '1.2rem' }}>{post._localLiked ? "❤️" : "🤍"}</span>
            <span style={{ marginRight: '5px' }}>{post.likes}</span>
          </button>

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
