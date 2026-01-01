import { BrowserRouter, Routes, Route, Link } from 'react-router'
import Home from './pages/HomePage/HomePage';
import styles from './styles/App.module.css';
import CreatePost from './pages/CreatePost/CreatePost.jsx';
import projectLogo from './assets/project-logo.png'
import PostPublished from './pages/CreatePost/PostPublished/PostPublished.jsx';
import ErrorPost from './pages/CreatePost/PostPublished/ErrorPost.jsx';
function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <header className={styles.appHeader}>
          <img src={projectLogo} alt="Logo" className={styles.appLogo} />
          <nav className={styles.appNav}>
            <Link to="/" className={styles.appLink}>Home</Link>
          </nav>
        </header>
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post-published" element={<PostPublished />} />
            <Route path="error" element={<ErrorPost />} />
          </Routes>
        </main>
        <footer className={styles.footer}>
          <p>&copy; 2024 My App</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
