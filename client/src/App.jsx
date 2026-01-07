import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Home from './pages/HomePageDemo/HomePageDemo.jsx';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import styles from './styles/App.module.css';
import TopicPage from './pages/TopicPage/TopicPage.jsx';
import projectLogo from './assets/project-logo.png'

function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <header className={styles.appHeader}>
          <img src={projectLogo} alt="Logo" className={styles.appLogo} />
          <nav className={styles.appNav}>
            <Link to="/" className={styles.appLink}>Home</Link>
            <Link to="/login" className={styles.appLink}>Login</Link>
            <Link to="/register" className={styles.appLink}>Register</Link>
          </nav>
        </header>
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/topics/:topicId" element={<TopicPage />} />
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
