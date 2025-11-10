import React, { useEffect, useState } from "react";
import API from "../api";

export default function UserDashboard({ user }) {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      console.log("Fetched posts:", res.data);
      setPosts(Array.isArray(res.data) ? res.data : res.data.posts || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Like a post
  const likePost = async (id) => {
    try {
      await API.post(`/posts/${id}/like`);
      fetchPosts();
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // Add comment to post
  const addComment = async (id) => {
  if (!commentText[id]?.trim()) return;

  try {
    const res = await API.post(`/posts/${id}/comments`, { text: commentText[id] });

    // If the comment was accepted and saved
    if (res.data?.comment) {
      setCommentText((prev) => ({ ...prev, [id]: "" }));
      fetchPosts();
    }
  } catch (err) {
    if (err.response?.data?.warning) {
      // 🚫 Negative comment detected — show message to user
      alert(`${err.response.data.message}\n\nSuggestion: ${err.response.data.suggestion}`);
    } else {
      console.error("Error adding comment:", err);
    }
  }
};



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">
        Welcome, {user?.name || "User"} 👋
      </h1>

      <div className="grid gap-4">
        {posts.length > 0 ? (
          posts.map((p) => (
            <div
              key={p._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-purple-700 mb-2">
                {p.title}
              </h3>
              <p className="text-gray-700 mb-3">{p.body}</p>

              {/* Like button */}
              <button
                onClick={() => likePost(p._id)}
                className="bg-pink-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-pink-600"
              >
                ❤️ Like ({p.likes.length || 0})
              </button>

              {/* Comments section */}
              <div className="mt-4">
                <h4 className="text-md font-semibold mb-2 text-gray-800">
                  Comments 💬
                </h4>
                <div className="space-y-2 mb-3">
                  {p.comments?.length > 0 ? (
                    p.comments.map((c, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-100 p-2 rounded-lg text-sm"
                      >
                        {c.text}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No comments yet.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 border px-3 py-2 rounded-lg"
                    value={commentText[p._id] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [p._id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    onClick={() => addComment(p._id)}
                    className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No posts yet. Please check later!</p>
        )}
      </div>
    </div>
  );
}