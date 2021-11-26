import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  let navigate = useNavigate();
  const [imageSelected, setImageSelected] = useState();

  const initialValues = {
    title: "",
    postText: "",
    image: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []);
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a Title!"),
    postText: Yup.string().required(),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("file", imageSelected);
    formData.append("upload_preset", "titzz75s");

    axios
      .post("https://api.cloudinary.com/v1_1/dfhqbiyir/image/upload", formData)
      .then((response) => {
        console.log(response.data.public_id);
        const fileName = response.data.public_id;

        axios
          .post("http://localhost:3001/posts", data, fileName, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          })
          .then((response) => {
            console.log(response);
            console.log(fileName);
            navigate("/");
          });
      });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Title...)"
          />
          <label>Post: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Post...)"
          />
          <label>File: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            type="file"
            id="inputCreatePost"
            name="image"
            onChange={(event) => {
              setImageSelected(event.target.files[0]);
            }}
          />

          <button type="submit"> Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
