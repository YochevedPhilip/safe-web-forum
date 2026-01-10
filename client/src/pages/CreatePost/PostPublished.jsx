import { useLocation } from "react-router-dom";

const PostPublished = () => {
  const location = useLocation();
  const { text } = location.state || { text: "No content" };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Post Published!</h1>
      <p>Your post has been successfully published.</p>
      <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}>
        <h3>Post Content:</h3>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default PostPublished;
