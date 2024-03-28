import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import NavAdmin from './NavAdmin';

import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";



const AdminAddCollection = () => {
  const navigate = useNavigate();
  const [relation_name, set_relation_name] = useState('');
  const ip = process.env.REACT_APP_IP

  // recupere les categories
  function get_name_relation() {
    axios.get(ip+"/api/getAllCategorie/").then((response) => {
      set_relation_name(response.data)
    })
  }
  useEffect(() => {
    if(!localStorage['is_admin']){
      navigate("/")
    }
    get_name_relation();

  }, [])

  // creer une collection
  function create_collection() {
    const new_name = document.querySelector(".new_name").value
    const relation_name = document.querySelector(".relation_name").value

    if (new_name && relation_name !== "Choissiez une categorie") {
      const inputData = {
        name: new_name,
        categorieName: relation_name
      };
      axios.post(ip+'/api/addCollection/', inputData)
        .then((response) => {
          if (response.data.status == true) {
            alert(response.data.message)
            navigate('/adminCollection')
          }
          else {
            //alert(response.data.message)
            console.log(response.data)
          }
        })
    }
    else {
      alert("Veuillez remplir tous les champs")
    }
  }
  return (
    <div>
      < NavAdmin/>
        <div className='second_header container-fluid'>
        <img src='/Admin/images/logo_user.png' alt="Logo" />
        <p>Add collection</p>
      </div>
      <form>
        <div className="form-group">
          <label htmlFor="name">name</label>
          <input type="text" className="form-control new_name" id="name" placeholder="nom collection" />
        </div>
        <div className="form-group">
          <label htmlFor="ccategorie_name">ccategorie name</label>
          <select className="form-select relation_name" aria-label="Default select example">
            <option>Choissiez une categorie</option>
            {
              relation_name.length ?
                relation_name.map(element => (
                  <option>{element.name}</option>
                ))
                : <option>Aucunes categorie existante</option>
            }
          </select>
        </div>
        <button type="button" className="btn btn-primary" onClick={create_collection}>Creer une collection</button>
      </form>
    </div>
  )
}

export default AdminAddCollection