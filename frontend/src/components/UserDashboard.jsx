import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import API from "../api";

const SKELETON_COUNT = 3;
const POLL_INTERVAL_MS = 15000;

const updatePostInList = (posts, id, updater) =>
  posts.map((p) => (p._id === id ? updater({ ...p }) : p));

export default function UserDashboard({ user, onLogout }) {
  const [posts, setPosts] = useState(null);
  const [commentText, setCommentText] = useState({});
  const pollingRef = useRef(null);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      const incoming = Array.isArray(res.data) ? res.data : res.data.posts || [];
      setPosts(incoming);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts. Try refreshing.");
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchPosts();
    pollingRef.current = setInterval(fetchPosts, POLL_INTERVAL_MS);
    return () => clearInterval(pollingRef.current);
  }, []);

  const likePost = async (id) => {
    if (!posts) return;
    const userId = user?._id || "local-user";
    const originalPost = posts.find((p) => p._id === id);
    const alreadyLiked = originalPost?.likes?.includes(userId);

    setPosts((prev) =>
      updatePostInList(prev, id, (p) => {
        p.likes = Array.isArray(p.likes) ? [...p.likes] : [];
        alreadyLiked ? (p.likes = p.likes.filter((l) => l !== userId)) : p.likes.push(userId);
        p._justLiked = !alreadyLiked;
        return p;
      })
    );

    try {
      await API.post(`/posts/${id}/like`);
      setTimeout(() => {
        setPosts((prev) =>
          updatePostInList(prev, id, (p) => {
            delete p._justLiked;
            return p;
          })
        );
      }, 600);
    } catch (err) {
      setPosts((prev) => updatePostInList(prev, id, () => originalPost));
      toast.error("Unable to like the post. Try again.");
    }
  };

  const addComment = async (postId) => {
    const content = (commentText[postId] || "").trim();
    if (!content) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticComment = {
      _id: tempId,
      text: content,
      author: { name: user?.name || "You" },
      createdAt: new Date().toISOString(),
      _optimistic: true,
    };

    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    setPosts((prev) =>
      updatePostInList(prev, postId, (p) => {
        p.comments = p.comments ? [...p.comments, optimisticComment] : [optimisticComment];
        return p;
      })
    );

    try {
      const res = await API.post(`/posts/${postId}/comments`, { text: content });
      if (res.data?.comment) {
        setPosts((prev) =>
          updatePostInList(prev, postId, (p) => {
            p.comments = p.comments.map((c) => (c._id === tempId ? res.data.comment : c));
            return p;
          })
        );
      } else await fetchPosts();
    } catch (err) {
      toast.error("Failed to add comment.");
      setPosts((prev) =>
        updatePostInList(prev, postId, (p) => {
          p.comments = p.comments.filter((c) => c._id !== tempId);
          return p;
        })
      );
    }
  };

  const timeAgo = (iso) => (iso ? dayjs(iso).fromNow() : "");

  const PostSkeleton = () => (
    <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 animate-pulse shadow-lg space-y-4">
      <div className="h-6 w-3/4 bg-white/20 rounded"></div>
      <div className="h-4 w-full bg-white/20 rounded"></div>
      <div className="h-4 w-5/6 bg-white/20 rounded"></div>
      <div className="h-8 w-full bg-white/20 rounded mt-2"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-6">
      <ToastContainer position="top-right" />
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">Hi, {user?.name || "there"} 👋</h1>
          <p className="text-sm text-white/70">Latest posts and activity</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={onLogout}
            className="bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Posts */}
      <main className="max-w-4xl mx-auto space-y-6">
        {posts === null ? (
          Array.from({ length: SKELETON_COUNT }).map((_, i) => <PostSkeleton key={i} />)
        ) : posts.length === 0 ? (
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
            <p className="text-white/70">Posts will appear here when created.</p>
          </div>
        ) : (
          <AnimatePresence>
            {posts.map((p) => (
              <motion.article
                key={p._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-purple-300">{p.title}</h3>
                  <span className="text-sm text-white/60">{timeAgo(p.createdAt)}</span>
                </div>
                <p className="text-white/80 mb-4">{p.body}</p>

                {/* Interactions */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => likePost(p._id)}
                    className={`px-3 py-1 rounded-full font-medium ${
                      p.likes?.length > 0
                        ? "bg-purple-600 text-white"
                        : "bg-white/20 text-white/80"
                    }`}
                  >
                    ♥ {p.likes?.length || 0}
                  </button>
                  <span className="text-sm text-white/60">{p.comments?.length || 0} comments</span>
                </div>

                {/* Comments */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 mb-3">
                  {(p.comments || []).map((c) => (
                    <div key={c._id} className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-semibold">
                        {c.author?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold">{c.author?.name || "Anonymous"}</span>
                            <span className="text-xs text-white/50">{timeAgo(c.createdAt)}</span>
                          </div>
                          <p className="text-sm text-white/80">{c.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!p.comments || p.comments.length === 0) && (
                    <div className="text-sm text-white/50">No comments yet — be the first!</div>
                  )}
                </div>

                {/* Add Comment */}
                <div className="flex gap-3 mt-2">
                  <input
                    value={commentText[p._id] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({ ...prev, [p._id]: e.target.value }))
                    }
                    placeholder="Add a comment..."
                    className="flex-1 rounded-xl px-4 py-2 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        addComment(p._id);
                      }
                    }}
                  />
                  <button
                    onClick={() => addComment(p._id)}
                    disabled={!commentText[p._id]?.trim()}
                    className={`px-4 py-2 rounded-xl font-semibold ${
                      commentText[p._id]?.trim()
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-white/20 text-white/50 cursor-not-allowed"
                    }`}
                  >
                    Send
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
