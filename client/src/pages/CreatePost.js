import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  let navigate = useNavigate();
  const [fileSelected, setFileSelected] = useState();
  const [title, setTitle] = useState();
  const [postText, setPostText] = useState();
  const [username, setUsername] = useState("");
  let { id } = useParams();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []);

  const upload = () => {
    const formData = new FormData();
    formData.append("file", fileSelected);
    formData.append("upload_preset", "titzz75s");

    axios
      .post("https://api.cloudinary.com/v1_1/dfhqbiyir/upload", formData)
      .then((response) => {
        console.log(response.data.public_id);
        console.log(response);
        const fileName = response.data.public_id;

        axios
          .post("http://localhost:3001/posts", {
            title: title,
            postText: postText,
            image: fileName,
            username: localStorage.getItem("username"),
          })

          .then((response) => {
            console.log(response);
            console.log(fileName);
          });
      });
  };

  return (
    <div className="Upload">
      <h1>Create A Post</h1>
      <div className="UploadForm">
        <input
          type="text"
          placeholder="Title..."
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Description..."
          onChange={(event) => {
            setPostText(event.target.value);
          }}
        />

        <input
          type="file"
          onChange={(e) => setFileSelected(e.target.files[0])}
        />
        <button onClick={upload}>Upload</button>
      </div>
    </div>
  );
}

export default CreatePost;
