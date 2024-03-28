import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import NavAdmin from './NavAdmin';

import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";



const AdminAddCategorie = () => {
  const navigate = useNavigate();
  const [relation_name, set_relation_name] = useState('');
  const ip = process.env.REACT_APP_IP

  // recupere le noms des categories
  function get_name_relation() {
    axios.get(ip+"/api/getAllCategorie").then((response) => {
      set_relation_name(response.data)
    })
  }

  // creer une categorie
  function create_categorie() {
    const new_name = document.querySelector(".new_name").value
    const relation_name = document.querySelector(".relation_name").value

    if (new_name) {
      if (relation_name == "Choissiez une categorie") {
        const inputData = {
          name: new_name,
        };
        axios.post(ip+'/api/addCategorie/', inputData)
          .then((response) => {
            if (response.data.status == true) {
              alert(response.data.message)
              navigate('/adminCategorie')
            }
            else {
              alert(response.data.message)
            }
          })
      }
      else {
        const inputData = {
          name: new_name,
          categorie_name:relation_name
        };
        axios.post(ip+'/api/addCategorie/', inputData)
          .then((response) => {
            if (response.data.status == true) {
              alert(response.data.message)
              navigate('/adminCategorie')
            }
            else {
              alert(response.data.message)
            }
          })
      }
    }
  }
  useEffect(() => {
    if(!localStorage['is_admin']){
      navigate("/")
    }
    get_name_relation();

  }, [])
  return (
    <div>
      < NavAdmin/>
      <div className='second_header container-fluid'>
        <img src='/Admin/images/logo_user.png' alt="Logo" />
        <p>Add categorie</p>
      </div>
      <form>
        <div className="form-group">
          <label htmlFor="name">name</label>
          <input type="text" className="form-control new_name" id="name" placeholder="nom categorie" />
        </div>
        <div className="form-group">
          <label htmlFor="categorie_name">categorie name</label>
          <select className="form-select relation_name" aria-label="Default select example">
            <option>Choissiez une categorie</option>
            {
              relation_name.length ?
                relation_name.map(element => (
                  <option>{element.name}</option>
                ))
                : <option>Aucune categorie existante</option>
            }
          </select>
        </div>
        <button type="button" className="btn btn-primary" onClick={create_categorie}>Creer une categorie</button>
      </form>
    </div>
  )
}

export default AdminAddCategorie