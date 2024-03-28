import React, { useState, useEffect, useMemo } from "react";
import personIcon from "../personIcon.png";
import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Login({}) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();
  const ip = process.env.REACT_APP_IP

  /**
   * Connecte l'utilsateur via google, avec si besoin création du compte
   *
   * @author Adrian Wahler
   * @version V1
   *
   * @params user Utilisateur Google (Généré par le plugin google)
   *
   **/
  const googleSuccessMessage = async (user) => {
    var userInfo = jwt_decode(user.credential);
    console.log(userInfo);

    let formData = new FormData();
    formData.append("email", userInfo.email);

    const emailExists = await (
      await fetch(ip+"/api/userEmailExists", {
        method: "POST",
        body: formData,
      })
    ).json();

    console.log(emailExists);

    if (emailExists) {
      console.log("Connecting Google User");
      var data = await (
        await fetch(ip+"/api/auth/connectGoogleUser", {
          method: "POST",
          body: formData,
        })
      ).json();

      if (data.status) {
        localStorage.setItem("token", data.token);
        if(data.is_admin){
          localStorage.setItem("is_admin", data.is_admin);
        }
        console.log(data.token);
        navigate("/");
      } else {
        setErrorMessage(data.message);
        console.log(data);
      }
    } else {
      let formData = new FormData();
      formData.append("last_name", userInfo.family_name);
      formData.append("first_name", userInfo.given_name);
      formData.append("birth_date", "1900-01-01");
      formData.append("email", userInfo.email);
      formData.append("password", "google_user");
      formData.append("is_google_user", true);

      const data = await (
        await fetch(ip+"/api/auth/register", {
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
    }
  };

  /**
   * Log un message d'erreur en cas d'erreur de connexion googlez
   *
   * @author Adrian Wahler adrian.wahler@gmail.com
   * @version V1
   *
   *
   **/
  const googleErrorMessage = (error) => {
    console.log(error);
  };

  /**
   *  Tente la connexion en regardant les données entrées, redirige page si connexion réussie
   *
   * @author Adrian Wahler adrian.wahler@gmail.com
   * @version V1
   *
   *
   **/
  const attemptLogin = async () => {
    let formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const data = await (
      await fetch(ip+"/api/auth/login", {
        method: "POST",
        body: formData,
      })
    ).json();

    if (data.status) {
      localStorage.setItem("token", data.token);
      if(data.is_admin) {
      localStorage.setItem("is_admin", data.is_admin);
      }
      navigate("/")
    } else {
      setErrorMessage("Indentifiants Incorrects");
    }
  };

  return (
    <div class="loginContainer">
      <div class="loginForm">
        <h1 class="title"> LOG IN </h1>
        <img
          src={personIcon}
          class="personIcon"
          style={{ alignSelf: "center" }}
        />
        <p> CUSTOMER ACCOUNT </p>
        <a class="link" href="/register">
          New user? register here!
        </a>
        <form
          class="credentialsForm"
          action={ip +"/api/auth/login"}
          method="POST"
        >
          {errorMessage && <p className="error"> {errorMessage} </p>}
          <input
            class="formInput mb-1"
            name="email"
            placeholder="E-mail"
            onChange={(e) => {
              setEmail(e.target.value);
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
        </form>
        <button class="formButton" onClick={attemptLogin}>
          LOGIN
        </button>
        <GoogleLogin
          onSuccess={googleSuccessMessage}
          onError={googleErrorMessage}
        />
        <a href="/passwordReset" class="link justifiedLeft">
          Forgot your password?
        </a>
      </div>
    </div>
  );
}

export default Login;
