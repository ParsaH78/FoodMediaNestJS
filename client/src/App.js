import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Messenger from "./pages/messenger/Messenger";
import ShareFood from "./pages/share/ShareFood";
import Post from "./pages/post/Post";
import { useEffect, useState } from "react";
import {getUser} from './api/index';
import jwt_decode from "jwt-decode";


function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const token = JSON.parse(localStorage.getItem('token')).access
      const decoded_token = jwt_decode(token)
      const id = decoded_token.user_id
    
      getUser(id).then(res => setUser(JSON.parse(res.data)))
    }
  }, [])


  return (
    <Router>
      <Routes>
        <Route exact path="/" element={user ? <Home user={user}/> : <Register />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/messenger" element={!user ? <Navigate to="/" /> : <Messenger user={user}/>} />
        <Route path="/profile/:id" element={user ? <Profile  user={user}/> : <Navigate to="/register" />} />
        <Route path="/share" element={user ? <ShareFood  user={user}/> : <Navigate to="/register" />}/>
        <Route path="/post/:id" element={user ? <Post  user={user}/> : <Navigate to="/register" />}/>       
      </Routes>
    </Router>
  );
}

export default App;

