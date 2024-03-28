import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Admin.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const UpdateUser = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [user, setUser] = useState("");
  const ip = process.env.REACT_APP_IP

  // recupere un utilisateur
  function get_user(id) {
    axios
      .get(ip+`/api/user/${id}`)
      .then((response) => {
        setUser(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  // mets a jour un utilisateur
  function update_user() {
    var inputs = document.forms["updateForm"].getElementsByTagName("input");
    let formData = new FormData();
    formData.append("id", id);

    for (let input of inputs) {
      if (input.value != "") {
        formData.append(input.name, input.value);
      }
    }

    axios({
      method: "post",
      url: ip+"/api/updateUser",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        console.log(response);
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  }
  useEffect(() => {
    if(!localStorage['is_admin']){
      navigate("/")
    }
    get_user(id);
  }, []);

  return (
    <div>
      <div className="second_header container-fluid">
        <img src="/Admin/images/logo_user.png" alt="Logo" />
        <p>Update user</p>
      </div>
      <form id="updateForm">
        <div className="form-group">
          <label htmlFor="name">First Name</label>
          <input
            type="text"
            className="form-control firstname"
            name="first_name"
            placeholder={user.first_name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Last Name</label>
          <input
            type="text"
            className="form-control lastname"
            name="last_name"
            placeholder={user.last_name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Email</label>
          <input
            type="email"
            className="form-control lastname"
            name="email"
            placeholder={user.email}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Password</label>
          <input
            type="text"
            className="form-control lastname"
            name="password"
            placeholder="************"
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Role</label>
          <input
            type="text"
            className="form-control lastname"
            name="password"
            placeholder={user.role}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={update_user}>
          Mettre à jour
        </button>
      </form>
    </div>
  );
};
export default UpdateUser;
