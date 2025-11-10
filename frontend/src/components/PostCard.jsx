import React, { useState } from "react";
import API from "../api";

export default function PostCard({ post, refresh }) {
  const [comment, setComment] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const likePost = async () => {
    await API.post(`/posts/${post._id}/like`);
    refresh();
  };

  const commentPost = async () => {
    if (!comment.trim()) return;

    try {
      setIsAnalyzing(true);

      // Step 1: Perform sentiment check
      const { data } = await API.post("/sentiment", { text: comment });
      if (data.sentiment === "negative" || data.sentiment === "toxic") {
        alert("⚠️ Please avoid posting negative or harmful comments.");
        setIsAnalyzing(false);
        return;
      }

      // Step 2: Post the comment
      await API.post(`/posts/${post._id}/comment`, { text: comment });
      setComment("");
      refresh();
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Something went wrong while adding your comment.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
      <p className="text-sm text-gray-500 mb-2">
        by {post.createdBy?.name || "Unknown"}
      </p>

      <button
        onClick={likePost}
        className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-lg mb-3"
      >
        ❤️ {post.likes.length || 0} Likes
      </button>

      <div className="space-y-1 mb-3">
        {post.comments.length ? (
          post.comments.map((c, i) => (
            <div key={i} className="bg-gray-100 px-3 py-1 rounded text-sm">
              💬 {c.text || c}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No comments yet</p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add comment..."
          disabled={isAnalyzing}
          className="border px-2 py-1 flex-grow rounded-lg disabled:opacity-50"
        />
        <button
          onClick={commentPost}
          disabled={isAnalyzing}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg disabled:opacity-50"
        >
          {isAnalyzing ? "Analyzing..." : "➤"}
        </button>
      </div>
    </div>
  );
}
