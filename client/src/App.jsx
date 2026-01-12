import { useContext } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom";

import Home from "./pages/HomePage.jsx";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import TopicPage from "./pages/TopicPage.jsx";
import CreatePost from "./pages/CreatePost/CreatePost.jsx";
import PostPublished from "./pages/CreatePost/PostPublished.jsx";
import ErrorPost from "./pages/CreatePost/ErrorPost.jsx";
import PostPage from "./pages/PostPage.jsx";
import AboutUs from "./pages/AboutUsPage.jsx";

import styles from "./styles/App.module.css";
import "./styles/global.css";
import logo from "./assets/logo.png";

import { AuthContext } from "./context/AuthContext.jsx";

function AppLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const username = user?.username || localStorage.getItem("username") || "User";

  return (
    <div className="app">
      {/* Header */}
      <header className={styles.appHeader}>
        {/* לוגו בצד שמאל */}
        <Link to="/">
          <img src={logo} alt="SafeTalk" className={styles.appLogo} />
        </Link>

        {/* תפריט ואווטאר בצד ימין */}
        <nav className={styles.appNav}>
          {user && pathname !== "/" && <Link to="/" className={styles.appLink}>Home</Link>}
          {user && pathname !== "/about" && <Link to="/about" className={styles.appLink}>About Us</Link>}
          {!user && pathname !== "/login" && <Link to="/login" className={styles.appLink}>Login</Link>}
          {!user && pathname !== "/register" && <Link to="/register" className={styles.appLink}>Register</Link>}
          {user && (
            <button
              type="button"
              className={styles.appLink}
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          )}

          {/* אווטאר */}
          <div className={styles.avatar} title={username}>
            {username.charAt(0).toUpperCase()}
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={user ? <AboutUs /> : <Navigate to="/login" />} />
          <Route path="/topics/:topicId" element={<TopicPage />} />
          <Route path="/topics/:topicId/create-post" element={<CreatePost />} />
          <Route path="/post-published" element={<PostPublished />} />
          <Route path="/error" element={<ErrorPost />} />
          <Route path="/posts/:postId" element={<PostPage />} />
          <Route path="/posts/:postId/comments" element={<PostPage />} />

        </Routes>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 SafeTalk</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
