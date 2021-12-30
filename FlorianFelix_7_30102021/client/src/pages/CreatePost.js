import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
function CreatePost() {
  let navigate = useNavigate();
  const [fileSelected, setFileSelected] = useState();
  const [title, setTitle] = useState();
  const [postText, setPostText] = useState();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []);

  const onInputChange = (e) => {
    setFileSelected(e.target.files[0]);
  };

  const upload = (e) => {
    const data = new FormData();

    data.append("file", fileSelected);
    data.append("title", title);
    data.append("postText", postText);
    data.append("username", authState.username);
    data.append("userId", authState.id);

    

    if (fileSelected) {
      axios
        .post("http://localhost:3001/posts", data)

        .then(() => {
          navigate("/");
        });
    } else {
      axios
        .post("http://localhost:3001/posts", {
          title: title,
          postText: postText,
          username: authState.username,
          UserId: authState.id,
        })

        .then(() => {
          navigate("/");
        });
    }
  };

  return (
    <div className="createPostPage">
      <div className="formContainer">
        <h1>Créer un post</h1>
        <input
          id="inputCreatePost"
          type="text"
          placeholder="Titre"
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <input
          id="inputCreatePost"
          type="text"
          placeholder="Texte"
          onChange={(event) => {
            setPostText(event.target.value);
          }}
        />

        <input type="file" onChange={onInputChange} />
        <button className="upload" onClick={upload}>
          Upload
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
