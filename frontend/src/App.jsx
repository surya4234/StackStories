import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            !user ? (
              <Navigate to="/login" />
            ) : user.role === "admin" ? (
              <AdminDashboard user={user} />
            ) : (
              <UserDashboard user={user} />
            )
          }
        />
      </Routes>
    </Router>
  );
}
// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
// import API from "./api";
// import LandingPage from "./components/LandingPage";
// import LoginPage from "./components/LoginPage";
// import RegisterPage from "./components/RegisterPage";
// import AdminDashboard from "./components/AdminDashboard";
// import UserDashboard from "./components/UserDashboard";

// export default function App() {
//   const [user, setUser] = useState(null);

//   // Check auth token on app load
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       // Decode token or fetch user info
//       API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       fetchUser();
//     }
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const res = await API.get("/auth/me"); // optional: backend route to get current user
//       setUser(res.data);
//     } catch (err) {
//       console.error("Error fetching user:", err);
//       localStorage.removeItem("token");
//       setUser(null);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     delete API.defaults.headers.common["Authorization"];
//     setUser(null);
//   };

//   // Role-based redirect
//   const getDashboard = () => {
//     if (!user) return <Navigate to="/login" />;
//     return user.role === "admin" ? (
//       <AdminDashboard user={user} />
//     ) : (
//       <UserDashboard user={user} />
//     );
//   };

//   return (
//     <Router>
//       {/* 🌐 Navbar */}
//       <nav className="flex justify-between items-center bg-purple-700 text-white px-6 py-3 shadow-md">
//         <Link to="/" className="text-xl font-bold">My Posts App</Link>
//         <div>
//           {!user ? (
//             <>
//               <Link to="/login" className="mr-4 hover:underline">Login</Link>
//               <Link to="/register" className="hover:underline">Register</Link>
//             </>
//           ) : (
//             <button
//               onClick={logout}
//               className="bg-white text-purple-700 px-3 py-1 rounded-lg hover:bg-gray-100"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </nav>

//       {/* 🔀 Routes */}
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route
//           path="/login"
//           element={<LoginPage setUser={setUser} />}
//         />
//         <Route
//           path="/register"
//           element={<RegisterPage />}
//         />
//         <Route
//           path="/dashboard"
//           element={getDashboard()}
//         />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// }
