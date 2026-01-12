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
import { useState } from "react";
function AppLayout() {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const username = user?.username || localStorage.getItem("username") || "User";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className={styles.appHeader}>
        {/* Logo on the left */}
        <Link to="/" className={styles.logoLink} onClick={() => setMobileMenuOpen(false)}>
          <img src={logo} alt="SafeTalk" className={styles.appLogo} />
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className={styles.mobileMenuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={mobileMenuOpen ? styles.hamburgerOpen : styles.hamburger}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Menu and avatar on the right */}
        <nav className={`${styles.appNav} ${mobileMenuOpen ? styles.appNavOpen : ''}`}>
          <div className={styles.navLinks}>
            {user && pathname !== "/" && (
              <Link to="/" className={styles.appLink} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            )}
            {user && pathname !== "/about" && (
              <Link to="/about" className={styles.appLink} onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            )}
            {!user && pathname !== "/login" && (
              <Link to="/login" className={styles.appLink} onClick={() => setMobileMenuOpen(false)}>Login</Link>
            )}
            {!user && pathname !== "/register" && (
              <Link to="/register" className={styles.appLink} onClick={() => setMobileMenuOpen(false)}>Register</Link>
            )}
            {user && (
              <button
                type="button"
                className={styles.appLink}
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>

          {/* Search Container */}
          <div className={styles.searchContainer}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Avatar */}
          {user && (
            <div className={styles.avatar} title={username}>
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </nav>
      </header>

      {/* Main */}
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={user ? <Home searchQuery={searchQuery} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={user ? <AboutUs /> : <Navigate to="/login" />} />
          <Route path="/topics/:topicId" element={<TopicPage searchQuery={searchQuery} />} />
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
