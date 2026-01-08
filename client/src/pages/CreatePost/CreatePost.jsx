import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";

const CreatePost = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handlePublish = async () => {
    if (title.length < 3) {
      navigate("/error", { state: { message: "Title is too short." } });
      return;
    }
    if (text.length < 10) {
      navigate("/error", { state: { message: "Content is too short." } });
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publisherId: "64c1f1d2a5e8b3a1f2c4d5e6", // לשים מזהה דינמי של המשתמש
          topicId,
          title,
          content: text,
          anonymous: isAnonymous
        })
      });

      const data = await res.json();

      if (res.status === 201) {
        navigate("/post-published", { state: { title, text, anonymous: isAnonymous } });
      } else {
        navigate("/error", { state: { message: data.messageToUser } });
      }

    } catch (err) {
      alert("Error publishing post: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create a Post</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title..."
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write something here..."
        rows={10}
        style={{ padding: "10px", width: "100%" }}
      />
      <div style={{ marginTop: "10px" }}>
        <label>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />{" "}
          Publish anonymously
        </label>
      </div>
      <button onClick={handlePublish} style={{ marginTop: "20px" }}>
        Publish Post
      </button>
    </div>
  );
};

export default CreatePost;
