import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Registration() {
  let navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
    email: "",
  };

  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const regexMail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/;

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required("3 caractères minimum"),
    password: Yup.string().required("8 caractères et 1 chiffre minimum"),
  });

  const onSubmit = (data) => {
    if (
      (regexMail.test(data.email) == true) &
      (regexPassword.test(data.password) == true)
    ) {
      axios.post("http://localhost:3001/auth", data).then((response) => {
        alert(response);
        navigate("/login");
      });
    } else {
      alert("Champ(s) non valide");
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="loginContainer">
          <h1>Register</h1>
          <label>Username: </label>
          <div className="sous_text">Entre 3 et 15 caractères</div>
          <ErrorMessage name="username" component="span" />
          <Field autoComplete="off" id="inputCreatePost" name="username" />
          <label>Password: </label>
          <div className="sous_text">
            1 Majuscule, 1 Chiffre et 8 caractères minimum
          </div>
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            type="password"
            id="inputCreatePost"
            name="password"
          />
          <label>Email: </label>
          <div className="sous_text">exemple@exemple.com</div>
          <ErrorMessage name="email" component="span" />
          <Field
            type="mail"
            autoComplete="off"
            id="inputCreatePost"
            name="email"
          />
          <button type="submit"> Register</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
