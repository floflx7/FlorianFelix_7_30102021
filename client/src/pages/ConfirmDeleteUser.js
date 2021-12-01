import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

import axios from "axios";

function ConfirmDelete() {
  let navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [test, setTest] = useState("");
  const { authState } = useContext(AuthContext);

  const [AuthState, setAuthState] = useState({
    username: authState.username,
    id: authState.id,
    status: true,
  });

  const id = authState.id;

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth/", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        console.log(authState);
      });
  }, []);

  const deleteUser = (id) => {
    if (password === passwordConfirm) {
      axios
        .delete(
          `http://localhost:3001/auth/delete/${id}`,

          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        )
        .then(() => {
          alert("mot de passe correct");
          navigate("/registration");
        });
    } else {
      alert("mot de passe incorrect");
      console.log(password);
      console.log(passwordConfirm);
    }
  };

  return (
    <div>
      <div className="loginContainer">
        <h1>Confirm your password to delete your account</h1>
        <input
          type="text"
          placeholder="Password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder=" Password..."
          onChange={(event) => {
            setPasswordConfirm(event.target.value);
          }}
        />
        <button onClick={deleteUser}> Save Changes</button>
      </div>
    </div>
  );
}

export default ConfirmDelete;
