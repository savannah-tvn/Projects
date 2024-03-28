import React, { useState, useEffect, useMemo } from "react";
import personIcon from "../personIcon.png";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Register({}) {
  const navigate = useNavigate();
  const [lastName, setLastName] = useState();
  const [firstName, setFirstName] = useState();
  const [birthDate, setBirthDate] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordComfirm, setPasswordComfirm] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const ip = process.env.REACT_APP_IP;

  /**
   * Fait l'inscription
   *
   * @author Adrian Wahler adrian.wahler@gmail.com
   * @version V1
   *
   * @return desc de return value
   **/
  const register = async () => {
    if (password != passwordComfirm) {
      setErrorMessage("Passwords do not match");
      return;
    }

    let formData = new FormData();
    formData.append("last_name", lastName);
    formData.append("first_name", firstName);
    formData.append("birth_date", birthDate);
    formData.append("email", email);
    formData.append("password", password);

    const data = await (
      await fetch(ip + "/api/auth/register", {
        method: "POST",
        body: formData,
      })
    ).json();

    if (data.status) {
      localStorage.setItem("token", data.token);
      console.log(data.token);
      navigate("/");
    } else {
      setErrorMessage(data.message);
      console.log(data);
    }
  };

  return (
    <div class="loginContainer">
      <div class="loginForm">
        <h1 class="title"> REGISTER </h1>
        <form class="credentialsForm">
          {errorMessage && <p className="error"> {errorMessage} </p>}
          <input
            class="formInput mb-1"
            name="first_name"
            placeholder="First Name"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          ></input>
          <input
            class="formInput mt-1 mb-1"
            name="last_name"
            placeholder="Last Name"
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          ></input>
          <input
            class="formInput mt-1 mb-1"
            name="email"
            placeholder="E-mail"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <input
            class="formInput mt-1 mb-1"
            name="birth_date"
            type="date"
            onChange={(e) => {
              setBirthDate(e.target.value);
            }}
          ></input>
          <input
            class="formInput mt-1 mb-1"
            name="password"
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <input
            class="formInput mt-1 mb-1"
            name="password_repeat"
            type="password"
            placeholder="Comfirm Password"
            onChange={(e) => {
              setPasswordComfirm(e.target.value);
            }}
          ></input>
        </form>
        <button class="formButton" onClick={register}>
          REGISTER
        </button>
      </div>
    </div>
  );
}

export default Register;
