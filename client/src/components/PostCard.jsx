import PropTypes from "prop-types";

export default function PostCard({ post, onOpen, onToggleLike }) {
  const postId = String(post.id ?? post._id);

  return (
    <div
      className="post-card" // משתמש בעיצוב היוקרתי מה-CSS
      onClick={() => onOpen(postId)}
    >
      <div className="post-header">
        <h3 className="post-title">{post.title}</h3>
      </div>

      <p className="post-content">{post.content}</p>

      <div style={{ marginBottom: '15px' }}>
        <small className="post-author">
          פורסם על ידי {post.author ?? "אנונימי"} ·{" "}
          {post.date ? new Date(post.date).toLocaleDateString('he-IL') : ""}
        </small>
      </div>

      <div className="post-footer">
        <div style={{ display: "flex", gap: "20px" }}>
          {/* כפתור לייק */}
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

          {/* תגובות */}
          <div className="like-section" style={{ cursor: 'default' }}>
            <span style={{ fontSize: '1.1rem' }}>💬</span>
            <span style={{ marginRight: '5px' }}>{post.comments ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// PropTypes נשארים ללא שינוי בכלל
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