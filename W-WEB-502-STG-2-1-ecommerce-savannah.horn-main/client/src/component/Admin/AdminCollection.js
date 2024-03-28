import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import NavAdmin from './NavAdmin';

import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AdminCollection = () => {
    const navigate = useNavigate();

    const [collection, set_collection] = useState('');
    const [collection_cache, set_collection_cache] = useState('')
    const ip = process.env.REACT_APP_IP

    // recherche dans une collection
    function search_collection() {
      let search = document.querySelector(".search_input").value;
  
      if (search) {
        if (collection_cache) {
          const filteredData = collection_cache.filter(entry => {
            const valuesToCheck = Object.values(entry).join(' ').toLowerCase();
            const searchTermLowerCase = search.toLowerCase();
            return valuesToCheck.includes(searchTermLowerCase);
          });
          set_collection(filteredData);
        }
        else {
          const filteredData = collection.filter(entry => {
            const valuesToCheck = Object.values(entry).join(' ').toLowerCase();
            const searchTermLowerCase = search.toLowerCase();
            return valuesToCheck.includes(searchTermLowerCase);
          });
          set_collection(filteredData);
        }
      }
      else {
        set_collection(collection_cache)
      }
    }

    // creer une collection
    function add_collection(){
        navigate('/AdminAddcollection');
    }

    // supprime une collection
    function delete_collection(event){
      const collection_id = event.target.id
      // lancer suppresions
      axios.post(ip+"/api/deleteCollection/"+collection_id).then((response) => {
        if(response.status == 200) {
            alert("Collection supprimé")
            get_info();
        }
        else {
            alert("Une erreur est survenu")
            console.log(response);
        }
      })
      
    }

    // mets a jour une collection
    function update_collection(event){
      const collection_id = event.target.id
      // lancer update
      navigate('/updatecollection/'+collection_id)
  
    }

    // recupere les collections
    function get_info(){
        axios.get(ip+"/api/getAllCollection").then((response) => {
        set_collection(response.data);
        set_collection_cache(response.data);
  
      })
    }
  
    useEffect(() => {
      if(!localStorage['is_admin']){
        navigate("/")
      }
      get_info();
  
    }, [])
    if (!collection) {
      return null;
    }
  return (
    <div>
      < NavAdmin/>
    <div className='second_header container-fluid'>
      <img src='./Admin/images/logo_user.png' alt="Logo" />
      <p>collection management</p>
    </div>
    <div className='cotainer-fluid'>
    <button type='button' className="btn btn-primary" onClick={add_collection}>Ajouter une collection</button>
      <div className='row search_form'>
        <form className='col-3'>
          <input type='search' className='search_input input-group-text' placeholder='Rechercher une collection'></input>
          <button type='button' className='btn btn-dark' onClick={search_collection}>Search</button>
        </form>
      </div>
    </div>
    <div className='container-fluid'>
      <table className="table">
        <thead>
          <tr>
            <th scope="col-1">Id</th>
            <th scope="col-1">Name</th>
            <th scope="col-2">categorie name</th>
          </tr>
        </thead>
        <tbody>
          {
            collection.map(element => (
              <tr key={element.id}>
                <th scope="row">{element.id}</th>
                <td>{element.name}</td>
                <td>{element.categorie_name}</td>
                <td className='p_modif'><p id={element.id} onClick={update_collection}>modifier</p> - <p onClick={delete_collection} id={element.id}>supprimer</p></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default AdminCollection