import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useParams } from 'react-router-dom';


const UpdateCollection = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const [collection, set_collection] = useState('');
    const [relation_name, set_relation_name] = useState('');
    const ip = process.env.REACT_APP_IP

    // recupere les categories
    function get_name_relation(){
      axios.get(ip+"/api/getAllCategorie").then((response) => {
        set_relation_name(response.data)
      })
    }

    // update une collection
    function update_collection(){
        const new_name = document.querySelector(".new_name").value
        const relation_name = document.querySelector(".relation_name").value

        if(new_name) {
            const inputData = {
                idCollection: id,
                newName: new_name,
                categorieName : relation_name,
              };
              
            axios.post(ip+'/api/updateNameCollection/', inputData)
            .then((response) => {
              if(response.data.status == true) {
                alert(response.data.message)
                navigate('/admincollection')

              }
            })
        }
        else {
          const inputData = {
            idCollection: id,
            newName: collection.name,
            categorieName : relation_name,
          };
          axios.post(ip+'/api/updateNameCollection/', inputData)
            .then((response) => {
              if(response.data.status == true) {
                alert(response.data.message)
                navigate('/admincollection')

              }
            })
        }
    }
    // recupere la collection
    function get_info(){
        
        axios.get(ip+"/api/getCollectionId/"+id).then((response) => {
        set_collection(response.data);
  
      })
    }
    useEffect(() => {
      if(!localStorage['is_admin']){
        navigate("/")
      }
        get_info();
        get_name_relation();
    
      }, [])
      if (!collection) {
        return null;
      }
  return (
    <div>
    <div className='second_header container-fluid'>
      <img src='/Admin/images/logo_user.png' alt="Logo" />
      <p>Update collection</p>
    </div>
    <form>
        {
        <div className="form-group">
          <label htmlFor="name">name</label>
          <input type="text" className="form-control new_name" id="name" placeholder={collection.name}/>
        </div>
        }
        <div className="form-group">
        <label htmlFor="categorie_name">categorie_name</label>
          <select className="form-select relation_name" aria-label="Default select example">
            <option>{collection.categorie_name}</option>
              {
                relation_name.length ? 
                relation_name.map(element => (
                  element.name == collection.categorie_name ? null
                  :
                  <option>{element.name}</option>
                ))
                : <option>Aucune categorie existante</option>
              }
          </select>
        </div>
        <button type="button" className="btn btn-primary" onClick={update_collection}>Mettre à jour</button>
    </form>
    </div>
  )
}

export default UpdateCollection