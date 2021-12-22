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

  const upload = () => {
    const formData = new FormData();
    formData.append("file", fileSelected);
    formData.append("upload_preset", "titzz75s");

    if (fileSelected) {
      axios
        .post("https://api.cloudinary.com/v1_1/dfhqbiyir/upload", formData)
        .then((response) => {
          const fileName = response.data.public_id;

          axios
            .post("http://localhost:3001/posts", {
              title: title,
              postText: postText,
              image: fileName,
              username: authState.username,
              UserId: authState.id,
            })

            .then(() => {
              navigate("/");
            });
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

        <input
          type="file"
          onChange={(e) => setFileSelected(e.target.files[0])}
        />
        <button className="upload" onClick={upload}>
          Upload
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
