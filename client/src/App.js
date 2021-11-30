import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import logo_1 from "./images/icon-left-font-monochrome-white.png";
import logo_2 from "./images/logo_blanc.png";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({
            username: "",
            id: 0,
            status: false,
          });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState(false);
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              {!authState.status ? (
                <>
                  <Link to="/login"> Se connecter </Link>
                  <Link to="/registration"> Créer un compte</Link>
                </>
              ) : (
                <>
                  <Link to="/">
                    <img
                      className="logo_1"
                      src={logo_1}
                      alt="Logo"
                      width="250"
                    />
                    <img
                      className="logo_2"
                      src={logo_2}
                      alt="Logo"
                      width="100"
                    />
                  </Link>
                  <Link to="/"> Accueil</Link>

                  <Link to="/createpost"> Créer un post</Link>
                </>
              )}
            </div>
            <div className="loggedInContainer">
              <h1>
                <Link to={`/profile/${authState.id}`}>
                  {authState.username}
                </Link>
              </h1>
              {authState.status && (
                <button onClick={logout}> Déconnexion</button>
              )}
            </div>
          </div>

          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/createpost" exact element={<CreatePost />} />
            <Route path="/post/:id" exact element={<Post />} />
            <Route path="/registration" exact element={<Registration />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/profile/:id" exact element={<Profile />} />
            <Route path="/changepassword" exact element={<ChangePassword />} />
            <Route path="*" exact element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>

      <div className="footer_page">
        <div className="text_footer_page">
          ©2021 - Orinoco
          <div class="col text-center">
            <a href="index.html">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="index.html">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
