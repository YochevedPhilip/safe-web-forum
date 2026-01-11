import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";

import Home from "./pages/HomePage.jsx";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import TopicPage from "./pages/TopicPage.jsx";
import CreatePost from "./pages/CreatePost/CreatePost.jsx";
import PostPublished from "./pages/CreatePost/PostPublished.jsx";
import ErrorPost from "./pages/CreatePost/ErrorPost.jsx";
import { Navigate } from "react-router-dom";

import styles from "./styles/App.module.css";
import projectLogo from "./assets/logoSashag.png";

import { AuthContext } from "./context/AuthContext.jsx";

function AppLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;



  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <img src={projectLogo} alt="Logo" className={styles.appLogo} />

        <nav className={styles.appNav}>
          {user && pathname !== "/" && (
            <Link to="/" className={styles.appLink}>
              Home
            </Link>
          )}

          {!user && pathname !== "/login" && (
            <Link to="/login" className={styles.appLink}>
              Login
            </Link>
          )}

          {!user && pathname !== "/register" && (
            <Link to="/register" className={styles.appLink}>
              Register
            </Link>
          )}

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
        </nav>
      </header>

      <main className={styles.main}>
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/topics/:topicId" element={<TopicPage />} />
          <Route path="/topics/:topicId/create-post" element={<CreatePost />} />
          <Route path="/post-published" element={<PostPublished />} />
          <Route path="/error" element={<ErrorPost />} />
        </Routes>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 My App</p>
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
