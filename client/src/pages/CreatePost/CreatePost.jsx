
import React, { useState } from "react";
import { useNavigate } from "react-router";

const CreatePost = () => {
    const [title, setTitle] = useState(""); 
  const [text, setText] = useState("");
   const navigate = useNavigate();
//צריך להוסיף שליחה לצאט שיחליט אם לפרסם או לא
const handlePublish = async () => {  // <-- כאן הפונקציה async
  if (title.length < 3) {
    navigate("/error", { state: { message: "Title is too short." } });
  } else if (text.length < 10) {
    navigate("/error", { state: { message: "Content is too short." } });
  } else if (text.includes("badword") || title.includes("badword")) {
    navigate("/error", { state: { message: "Your post contains inappropriate content." } });
  } else {
    try {
      // שולח את הפוסט לשרת / MongoDB
      await fetch("http://localhost:5001/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publisherId: "64c1f1d2a5e8b3a1f2c4d5e6",
          topicId: "64c1f1d2a5e8b3a1f2c4d5e7",
          title,
          content: text
        }),
      });

      // אחרי ההצלחה – ניווט לעמוד הפוסט
      navigate("/post-published");
    } catch (err) {
      alert("Error publishing post: " + err.message);
    }
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <p>Welcome! Here you can start writing your post.</p>
      <input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder="Enter post title..."
  style={{ padding: "10px", fontSize: "16px", width: "100%", marginBottom: "10px" }}
/>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write something here..."
        rows={10}
        cols={50}
        style={{ padding: "10px", fontSize: "16px" }}
       />
        <div style={{ marginTop: "20px" }}>
        <button onClick={handlePublish}>Publish Post</button>
      </div>
       </div>
  );
};

export default CreatePost;