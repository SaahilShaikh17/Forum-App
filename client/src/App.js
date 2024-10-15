// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from './components/Navbar';
import { Forum } from './pages/forum/Forum';
import { About } from './pages/about/about';
import { LoginScreen } from './pages/login/login';
import CreatePost from './pages/forum/CreatePost'; // Import as default
import Profile from './pages/forum/profile';
import RegisterForm from './pages/register/Register';
import SinglePostView from './pages/forum/SinglePostView';

function App() {
  return (
    <>
      <div className="App">
          <Router>
            <Navbar />
            <Routes>
              <Route path="/"  element={<Forum />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/create-post" element={<CreatePost />} /> {/* Corrected path */}
              <Route path="/posts/:postId" element={<SinglePostView/>} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Router>
      </div>
    </>
  );
}

export default App;