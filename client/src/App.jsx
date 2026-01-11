import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/HomePageDemo/HomePageDemo.jsx';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import TopicPage from './pages/TopicPage/TopicPage.jsx';
import CreatePost from './pages/CreatePost/CreatePost.jsx';
import PostPublished from './pages/CreatePost/PostPublished/PostPublished.jsx';
import ErrorPost from './pages/CreatePost/PostPublished/ErrorPost.jsx'; 
import logo from './assets/logo.png';

// ייבוא שני סוגי העיצוב
import styles from './styles/App.module.css'; // לעיצוב ה-Header וה-Main
import './styles/global.css';                // לעיצוב הפוטר והחיפוש

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const username = localStorage.getItem("username") || "User";

  return (
    <BrowserRouter>
      <div className="app">
        {/* Header משתמש ב-CSS Module */}
        <header className={styles.appHeader}>
          <div className={styles.headerRight}>
            <Link to="/">
              <img src={logo} alt="SafeTalk" className={styles.appLogo} />
            </Link>
          </div>
        
          <nav className={styles.appNav}>
            {/* אווטאר - עיצוב Module */}
            <div className={styles.avatar} title={username}>
              {username.charAt(0).toUpperCase()}
            </div>
            
            <Link to="/" className={styles.appLink}>Home</Link>
            <Link to="/login" className={styles.appLink}>Login</Link>
            <Link to="/register" className={styles.appLink}>Register</Link>

            {/* החיפוש - משתמש ב-Global CSS */}
            <div className="searchContainer">
              <input 
                type="text" 
                placeholder="חיפוש נושא או פוסט..." 
                className="searchField"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="searchButtonIcon">🔍</span>
            </div>
          </nav>
        </header>

        {/* Main - משתמש ב-Module */}
        <main className={styles.main}>
          <Routes>
          <Route path="/topics/:topicId" element={<TopicPage searchQuery={searchQuery} />} />
            <Route path="/" element={<Home searchQuery={searchQuery} />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/topics/:topicId" element={<TopicPage />} />
            <Route path="/topics/:topicId/create-post" element={<CreatePost />} />
            <Route path="/post-published" element={<PostPublished />} />
            <Route path="/error" element={<ErrorPost />} />
          </Routes>
        </main>

        {/* Footer - משתמש ב-Global CSS (כדי שיהיה ורוד!) */}
        <footer className="footer">
          <p>&copy; 2024 SafeTalk</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;