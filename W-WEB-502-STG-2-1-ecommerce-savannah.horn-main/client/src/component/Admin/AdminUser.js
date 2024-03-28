import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Admin.css";
import NavAdmin from "./NavAdmin";

import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminUser = () => {

  const navigate = useNavigate();

  const [user, set_user] = useState('');
  const [user_cache, set_user_cache] = useState('')
  const ip = process.env.REACT_APP_IP

  // recherche dans les utilisateur
  function search_user() {
    let search = document.querySelector(".search_input").value;

    if (search) {
      if (user_cache) {
        const filteredData = user_cache.filter((entry) => {
          const valuesToCheck = Object.values(entry).join(" ").toLowerCase();
          const searchTermLowerCase = search.toLowerCase();
          return valuesToCheck.includes(searchTermLowerCase);
        });
        set_user(filteredData);
      } else {
        const filteredData = user.filter((entry) => {
          const valuesToCheck = Object.values(entry).join(" ").toLowerCase();
          const searchTermLowerCase = search.toLowerCase();
          return valuesToCheck.includes(searchTermLowerCase);
        });
        set_user(filteredData);
      }
    } else {
      set_user(user_cache);
    }
  }

  // supprime un utilisateur
  function delete_user(event) {
    const user_id = event.target.id;

    console.log(user_id);
    axios.delete(ip+`/api/user/${user_id}`);


    const modifiedData = removeObjectByKey(user, user_id);
    set_user(user);
    alert("Utilisateur supprimé");
  }

  // mets a jour un utilisateur
  function update_user(event) {
    const user_id = event.target.id;
    // lancer update
    navigate("/UpdateUser/" + user_id);
  }
  const removeObjectByKey = (obj, keyToDelete) => {
    const filteredObject = Object.keys(obj).reduce((acc, key) => {
      if (key !== keyToDelete) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
    return filteredObject;
  };

  useEffect(() => {
    if(!localStorage['is_admin']){
      navigate("/")
    }
    axios.get(ip+"/api/getAllUser").then((response) => {
      set_user(response.data);
      set_user_cache(response.data);
    });
  }, []);
  if (!user) {
    return null;
  }

  return (
    <div>
      <NavAdmin />
      <div className="second_header container-fluid">
        <img src="./Admin/images/logo_user.png" alt="Logo" />
        <p>User management</p>
      </div>
      <div className="cotainer-fluid">
        <div className="row search_form">
          <form className="col-3">
            <input
              type="search"
              className="search_input input-group-text"
              placeholder="Search someone"
            ></input>
            <button
              type="button"
              className="btn btn-dark"
              onClick={search_user}
            >
              Search
            </button>
          </form>
        </div>
      </div>
      <div className='container-fluid'>
        <table className="table ble">
          <thead>
            <tr>
              <th scope="col-1">Id</th>
              <th scope="col-1">Firstname</th>
              <th scope="col-2">Lastname</th>
              <th scope="col-1">Birthdate</th>
              <th scope="col-2">Email</th>
              <th scope="col-1">Password</th>
              <th scope="col-1">Role</th>
              <th scope="col-1">Status card</th>
              <th scope="col-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {user.map((element) => (
              <tr key={element.id}>
                <th scope="row">{element.id}</th>
                <td>{element.first_name}</td>
                <td>{element.last_name}</td>
                <td>{element.birth_date}</td>
                <td>{element.email}</td>
                <td>**********</td>
                <td>{element.role}</td>
                <td>true</td>
                <td className="p_modif">
                  <p id={element.id} onClick={update_user}>
                    modifier
                  </p>{" "}
                  -{" "}
                  <p onClick={delete_user} id={element.id}>
                    supprimer
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUser;
