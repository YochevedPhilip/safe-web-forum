import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/HomePageDemo/HomePageDemo.jsx';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import styles from './styles/App.module.css';
import TopicPage from './pages/TopicPage/TopicPage.jsx';
import CreatePost from './pages/CreatePost/CreatePost.jsx';
import PostPublished from './pages/CreatePost/PostPublished/PostPublished.jsx';
import ErrorPost from './pages/CreatePost/PostPublished/ErrorPost.jsx'; 
import logo from './assets/logo.png';
import { useState } from 'react'; // הוסיפי את השורה הזו
function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const username = localStorage.getItem("username") || "User";

  return (
    <BrowserRouter>
      <div className="app">
        <header className={styles.appHeader}>
          {/* לוגו בצד אחד */}
          <div className={styles.headerRight}>
            <Link to="/">
              <img src={logo} alt="SafeTalk" className={styles.appLogo} />
            </Link>
          </div>
        
          {/* תפריט ואווטאר בצד השני */}
          <nav className={styles.appNav} style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <div className={styles.avatar} title={username} style={{
              width: '45px', 
              height: '45px', 
              borderRadius: '50%', 
              backgroundColor: '#5fb3c1', // כחול שמיים עדין וקלאסי
              color: 'white', 
              display: 'grid', 
              placeItems: 'center',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginLeft: '10px',
              cursor: 'pointer',
              border: '2px solid white' // מסגרת לבנה עדינה להבלטה
            }}>
              {username.charAt(0).toUpperCase()}
            </div>
            <Link to="/" className={styles.appLink}>Home</Link>
            <Link to="/login" className={styles.appLink}>Login</Link>
            <Link to="/register" className={styles.appLink}>Register</Link>
            <div className="searchContainer">
    <input 
     type="text" 
     placeholder="חיפוש נושא או פוסט..." 
     className="searchField"
     value={searchQuery}              // שורה להוספה
     onChange={(e) => setSearchQuery(e.target.value)} // שורה להוספה
   />
    <span className="searchButtonIcon">🔍</span>
  </div>
            {/* אווטאר בצבע כחול פסטל קלאסי */}
          </nav>
        </header>

        <main className={styles.main}>
          <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} /> 
                     <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/topics/:topicId" element={<TopicPage />} />
            <Route path="/topics/:topicId/create-post" element={<CreatePost />} />
            <Route path="/post-published" element={<PostPublished />} />
            <Route path="/error" element={<ErrorPost />} />
          </Routes>
        </main>

        <footer className={styles.footer}>
          <p>&copy; 2024 SafeTalk</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;