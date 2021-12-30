import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { Image } from "cloudinary-react";

function Profile() {
  let { id } = useParams();
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  const [AuthState, setAuthState] = useState({
    username: authState.username,
    id: authState.id,
    status: true,
  });

  const logout = () => {
    setAuthState({ username: "", id: 0, status: false, isAdmin: false });
    localStorage.removeItem("accessToken");
  };

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {
      setUsername(response.data.username);
    });

    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, []);

  const deleteUser = (id) => {
    axios
      .delete(`http://localhost:3001/auth/delete/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(logout(), navigate("/registration"));
  };

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        {authState.isAdmin !== true && (
          <button
            onClick={() => {
              let confirm = window.confirm(
                "Voulez vous supprimer votre compte ?"
              );
              if (confirm) {
                deleteUser(authState.id);
              } else {
                navigate(`/profile/${authState.id}`);
              }
            }}
          >
            Supprimer mon compte
          </button>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="title"> {value.title} </div>
              <div
                className="body"
                onClick={() => {
                  navigate(`/post/${value.id}`);
                }}
              >
                <img className="PostImage" src={value.image} />
                {value.postText}
              </div>
              <div className="footer">
                <div className="username">{value.username}</div>
                <div className="buttons">
                  <label> {value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
