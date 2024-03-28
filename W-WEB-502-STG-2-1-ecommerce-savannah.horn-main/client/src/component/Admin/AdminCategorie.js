import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import NavAdmin from './NavAdmin';

import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AdminCategorie = () => {
    const navigate = useNavigate();

    const [categorie, set_categorie] = useState('');
    const [categorie_cache, set_categorie_cache] = useState('')
    const ip = process.env.REACT_APP_IP


    // permet de rechercher dans une categorie
    function search_categorie() {
      let search = document.querySelector(".search_input").value;
  
      if (search) {
        if (categorie_cache) {
          const filteredData = categorie_cache.filter(entry => {
            const valuesToCheck = Object.values(entry).join(' ').toLowerCase();
            const searchTermLowerCase = search.toLowerCase();
            return valuesToCheck.includes(searchTermLowerCase);
          });
          set_categorie(filteredData);
        }
        else {
          const filteredData = categorie.filter(entry => {
            const valuesToCheck = Object.values(entry).join(' ').toLowerCase();
            const searchTermLowerCase = search.toLowerCase();
            return valuesToCheck.includes(searchTermLowerCase);
          });
          set_categorie(filteredData);
        }
      }
      else {
        set_categorie(categorie_cache)
      }
    }

    // creer une categorie
    function add_categorie(){
        navigate('/AdminAddCategorie');
    }

    // supprime une categorie
    function delete_categorie(event){
      const categorie_id = event.target.id
      // lancer suppresions
      axios.post(ip+"/api/deleteCategorie/"+categorie_id).then((response) => {
        if(response.status == 200) {
            alert("Categorie supprimé")
            get_info();
        }
        else {
            alert("Une erreur est survenu")
            console.log(response);
        }
      })
      
    }

    // met a jour une categorie
    function update_categorie(event){
      const categorie_id = event.target.id
      // lancer update
      navigate('/updateCategorie/'+categorie_id)
  
    }

    // recupere les categories
    function get_info(){
        axios.get(ip+"/api/getAllCategorie").then((response) => {
        set_categorie(response.data);
        set_categorie_cache(response.data);
  
      })
    }
  
    useEffect(() => {
      if(!localStorage['is_admin']){
        navigate("/")
      }
      get_info();
  
    }, [])
    if (!categorie) {
      return null;
    }
  return (
    <div>
      < NavAdmin/>
    <div className='second_header container-fluid'>
      <img src='./Admin/images/logo_user.png' alt="Logo" />
      <p>categorie management</p>
    </div>
    <div className='cotainer-fluid'>
    <button type='button' className="btn btn-primary" onClick={add_categorie}>Ajouter une categorie</button>
      <div className='row search_form'>
        <form className='col-3'>
          <input type='search' className='search_input input-group-text' placeholder='Rechercher une categorie'></input>
          <button type='button' className='btn btn-dark' onClick={search_categorie}>Search</button>
        </form>
      </div>
    </div>
    <div className='container-fluid'>
      <table className="table">
        <thead>
          <tr>
            <th scope="col-1">Id</th>
            <th scope="col-1">Name</th>
            <th scope="col-2">Categorie name</th>
          </tr>
        </thead>
        <tbody>
          {
            categorie.map(element => (
              <tr key={element.id}>
                <th scope="row">{element.id}</th>
                <td>{element.name}</td>
                <td>{element.collection_name}</td>
                <td className='p_modif'><p id={element.id} onClick={update_categorie}>modifier</p> - <p onClick={delete_categorie} id={element.id}>supprimer</p></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default AdminCategorie