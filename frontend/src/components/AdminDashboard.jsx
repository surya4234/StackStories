import React, { useEffect, useState } from "react";
import API from "../api";

export default function AdminDashboard({ user }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(Array.isArray(res.data) ? res.data : res.data.posts || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create new post
  const createPost = async () => {
    if (!title.trim() || !body.trim()) return alert("Please fill both fields");
    try {
      await API.post("/posts", { title, body });
      setTitle("");
      setBody("");
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">
        Admin Dashboard 🧑‍💼
      </h1>

      {/* Create Post */}
      <div className="bg-white p-5 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-3">Create a New Post</h2>
        <input
          type="text"
          placeholder="Enter post title..."
          className="w-full border px-3 py-2 mb-3 rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter post body..."
          className="w-full border px-3 py-2 mb-3 rounded-lg"
          rows="4"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          onClick={createPost}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Create Post
        </button>
      </div>

      {/* Display Posts */}
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
              <p className="text-sm text-gray-500">
                ❤️ Likes: {Array.isArray(p.likes) ? p.likes.length : p.likes || 0} | 💬 Comments:{" "}
                {p.comments?.length || 0}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No posts yet. Create one above!</p>
        )}
      </div>
    </div>
  );
}
