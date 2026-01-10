import PropTypes from "prop-types";


export default function PostCard({ post, onOpen, onToggleLike }) {
  const postId = String(post.id ?? post._id);

  return (
    <div
      onClick={() => onOpen(postId)}
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "12px",
        cursor: "pointer",
      }}
    >
      <h3>{post.title}</h3>
      <p>{post.content}</p>

      <small>
        נכתב על ידי {post.author ?? "משתמש אנונימי"} ·{" "}
        {post.date ? new Date(post.date).toLocaleDateString() : ""}
      </small>
      
      <div style={{ marginTop: 8, display: "flex", gap: 16, direction: "ltr",}}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(post);
          }}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {post._localLiked ? "❤️" : "🤍"} {post.likes}
        </button>

        <span>💬 {post.comments ?? 0}</span>
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
