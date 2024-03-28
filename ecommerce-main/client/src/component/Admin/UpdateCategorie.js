import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import NavAdmin from './NavAdmin';
import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useParams } from 'react-router-dom';


const UpdateCategorie = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const [categorie, set_categorie] = useState('');
    const [categorie_name, set_categorie_name] = useState('');
    const [photos, set_photos] = useState('');
    const ip = process.env.REACT_APP_IP

    // ajoute une photo a une categorie
    function add_photos(){
      const id_article = id;
  
      const inputData = new FormData();
    
      const photos = document.querySelector(".photos").files;
    
      for (let i = 0; i < photos.length; i++) {
        inputData.append("photos[]", photos[i]);
      }
      axios.post(ip+'/api/addPhotosCategorie/'+id_article, inputData)
        .then((response) => {
          if (response.data.status == true) {
            alert(response.data.message);
            get_photos(id_article)
          } else {
            alert(response.data);
          }
        });
    }
    // supprime une photo d'une categorie
    function delete_photo(event) {
      const id_photos = event.target.id;
  
      axios.post(ip+'/api/deletePhotosCategorie/'+id_photos)
        .then((response) => {
          if (response.data.status == true) {
            alert(response.data.message)
            get_photos(id)
          }
          else {
            alert(response.data.message)
          }
        })
    }

    // mets a jour une categorie
    function update_categorie(){
      const relation_name = document.querySelector(".relation_name").value
      
        const new_name = document.querySelector(".new_name").value
        if(new_name) {
            const inputData = {
                idCategorie: id,
                newName: new_name,
                categorieName:relation_name,
              };
            axios.post(ip+'/api/updateNameCategorie/', inputData)
            .then((response) => {
              if(response.data.status == true) {
                alert(response.data.message)
                navigate('/adminCategorie')

              }
              else {
                console.log(response.data)
              }
            })
        }
        else {
          const inputData = {
            idCategorie: id,
            newName: categorie.name,
            categorieName:relation_name,
          };
        axios.post(ip+'/api/updateNameCategorie/', inputData)
        .then((response) => {
          if(response.data.status == true) {
            alert(response.data.message)
            navigate('/adminCategorie')

          }
          else {
            console.log(response.data)
          }
        })
        }
    }
    // recupere les photos de la categorie
    function get_photos(id) {
      axios.get(ip+"/api/getPhotosCategorie/" + id).then((response) => {
        set_photos(response.data);
  
      })
    }
    // recupere la categorie
    function get_info(){
        
        axios.get(ip+"/api/getCategorieId/"+id).then((response) => {
        set_categorie(response.data);
  
      })
    }
    // recupere les categories
    function get_name_relation(){
      axios.get(ip+"/api/getAllCategorie").then((response) => {
        set_categorie_name(response.data)
      })
    }
    useEffect(() => {
      if(!localStorage['is_admin']){
        navigate("/")
      }
        get_info();
        get_name_relation();
        get_photos(id);
      }, [])
      if (!categorie) {
        return null;
      }
  return (
    <div>
      < NavAdmin/>
    <div className='second_header container-fluid'>
      <img src='/Admin/images/logo_user.png' alt="Logo" />
      <p>Update categorie</p>
    </div>
    <form>
        {
        <div className="form-group">
            <label htmlFor="name">name</label>
            <input type="text" className="form-control new_name" id="name" placeholder={categorie.name}/>
        </div>
        }
        <div className="form-group">
            <label htmlFor="categorie_name">Categorie name</label>
            <select class="form-select relation_name" aria-label="Default select example">
              <option>{categorie.categorie_name}</option>
              {
                categorie_name.length ? 
                categorie_name.map(element => (
                  categorie.name == element.name  ? null
                  : <option>{element.name}</option>
                ))
                : <option>Aucunes categorie existante</option>
              }
            </select>
        </div>
        <button type="button" className="btn btn-primary" onClick={update_categorie}>Mettre à jour</button>
    </form>
    <h2>Photos de la categorie:</h2>
      {photos.length > 0 ?
        photos.map((element, index) => (
          <div key={index} className='containter-fluid'>
            <div className='cont-photo'>
              <div>
                <img src={ip+'/storage/' + element.urlPhoto}></img>
              </div>
              <button id={element.id} type='button' className='btn btn-primary' onClick={delete_photo}>Supprimer</button>
            </div>
          </div>
        ))
        : <p>Aucunes photos pour cette categorie</p>}
        <form encType="multipart/form-data">
          <label htmlFor="photos">Ajouter une/des photos</label>
          <input type="file" className="form-control photos" name='photos[]' multiple id="photos" placeholder="photos"/>
          <button type="button" className="btn btn-primary" onClick={add_photos}>Ajouter</button>
        </form>
    </div>
  )
}

export default UpdateCategorie