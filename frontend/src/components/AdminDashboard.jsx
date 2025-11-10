import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AdminDashboard({ user }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white py-10 px-6 relative">
      <div className="max-w-5xl mx-auto">

        {/* Logout button top-right */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 border border-white/30 backdrop-blur-lg rounded-lg hover:bg-white/20 transition text-white"
          >
            Logout
          </button>
        </div>

        {/* Header */}
        <h1 className="text-4xl font-semibold mb-8 text-center">
          Admin Dashboard
        </h1>

        {/* Create Post */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-2xl shadow-lg mb-10">
          <h2 className="text-2xl font-semibold mb-4">Create a New Post</h2>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Post Title..."
              className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Post Content..."
              rows="4"
              className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-300"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />

            <button
              onClick={createPost}
              className="w-full bg-purple-600 hover:bg-purple-700 transition-all py-2 rounded-lg font-medium"
            >
              Publish Post
            </button>
          </div>
        </div>

        {/* Posts List */}
        <h2 className="text-2xl font-semibold mb-4">Existing Posts</h2>

        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((p) => (
              <div
                key={p._id}
                className="backdrop-blur-lg bg-white/10 border border-white/20 p-5 rounded-xl hover:bg-white/20 transition"
              >
                <h3 className="text-xl font-semibold text-purple-300 mb-2">
                  {p.title}
                </h3>

                <div
                  className="text-gray-200 mb-3 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: p.body }}
                />

                <p className="text-sm text-gray-300">
                  ❤️ {Array.isArray(p.likes) ? p.likes.length : p.likes || 0} Likes | 💬 {p.comments?.length || 0} Comments
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-300 text-center">
              No posts yet. Create one above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
