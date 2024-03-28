import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import NavAdmin from './NavAdmin';
import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useParams } from 'react-router-dom';


const UpdateArticle = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [article, set_article] = useState('');
  const [photos, set_photos] = useState('');
  const [relation_name, set_relation_name] = useState('');
  const ip = process.env.REACT_APP_IP

  // ajoute une photo
  function add_photos(){
    const id_article = id;

    const inputData = new FormData();
  
    const photos = document.querySelector(".photos").files;
  
    for (let i = 0; i < photos.length; i++) {
      inputData.append("photos[]", photos[i]);
    }
    axios.post(ip+'/api/addPhotos/'+id_article, inputData)
      .then((response) => {
        if (response.data.status == true) {
          alert(response.data.message);
          get_photos(id_article)
        } else {
          alert(response.data);
        }
      });
  }
  // supprime une photo
  function delete_photo(event) {
    const id_photos = event.target.id;

    axios.post(ip+'/api/deletePhotos/'+id_photos)
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

  // mets a jour un article
  function update_article() {
    const inputs = document.querySelectorAll('.form-group > input');
    const relation_name = document.querySelector(".relation_name").value
    let inputData = {
      id: id,
    }
    inputs.forEach(element => {
      if (element.value) {
        inputData[element.id] = element.value
      }
    });
    inputData['collection_name'] = relation_name;

    axios.post(ip+'/api/updateArticle/', inputData)
      .then((response) => {
        if (response.data.status == true) {
          alert(response.data.message)
          get_info(id)

        } else {
          console.log(response.data)
        }
      })
  }
  // recupere les collections
  function get_name_relation(){
    axios.get(ip+"/api/getAllCollection/").then((response) => {
      set_relation_name(response.data)
    })
  }
  // recupere un article
  function get_info() {

    axios.get(ip+"/api/getArticleId/" + id).then((response) => {
      set_article(response.data.article);

    })
  }
  // recupere une photo
  function get_photos(id) {
    axios.get(ip+"/api/getPhotos/" + id).then((response) => {
      set_photos(response.data);

    })
  }
  useEffect(() => {
    if(!localStorage['is_admin']){
      navigate("/")
    }
    get_info();
    get_photos(id);
    get_name_relation();

  }, [])
  if (!article) {
    return null;
  }
  return (
    <div>
      < NavAdmin/>
      <div className='second_header container-fluid'>
        <img src='/Admin/images/logo_user.png' alt="Logo" />
        <p>Update article</p>
      </div>
      <form>
        <div className="form-group">
          <label htmlFor="description">description</label>
          <input type="text" className="form-control description" id="description" placeholder={article.description} />
        </div>
        <div className="form-group">
          <label htmlFor="caracteristique">caracteristique</label>
          <input type="text" className="form-control" id="caracteristique" placeholder={article.caracteristique} />
        </div>
        <div className="form-group">
        <label htmlFor="collection_name">collection_name</label>
        <select className="form-select relation_name" aria-label="Default select example">
              <option>{article.collection_name}</option>
              {
                relation_name.length ? 
                relation_name.map(element => (
                  article.collection_name == element.name  ? null
                  : <option>{element.name}</option>
                ))
                : <option>Aucunes collection existante</option>
              }
            </select>
        </div>
        <div className="form-group">
          <label htmlFor="prix">prix</label>
          <input type="text" className="form-control" id="prix" placeholder={article.prix} />
        </div>
        <div className="form-group">
          <label htmlFor="poids">poids</label>
          <input type="text" className="form-control" id="poids" placeholder={article.poids} />
        </div>
        <div className="form-group">
          <label htmlFor="couleur">couleur</label>
          <input type="text" className="form-control" id="couleur" placeholder={article.couleur} />
        </div>
        <div className="form-group">
          <label htmlFor="stock">stock bobine</label>
          <input
            type="text"
            className="form-control"
            id="stock_bobine"
            placeholder={article.stock_bobine}
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">stock bande</label>
          <input
            type="text"
            className="form-control"
            id="stock_bande"
            placeholder={article.stock_bande}
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">stock vrac</label>
          <input
            type="text"
            className="form-control"
            id="stock_vrac"
            placeholder={article.stock_vrac}
          />
        </div>
        <div className="form-group">
          <label htmlFor="promotion">promotion</label>
          <input type="text" className="form-control" id="promotion" placeholder={article.promotion} />
        </div>
        <button type="button" className="btn btn-primary" onClick={update_article}>Mettre à jour</button>
      </form>
      <h2>Photos de l'article:</h2>
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
        : <p>Aucunes photos pour cet article</p>}
        <form encType="multipart/form-data">
          <label htmlFor="photos">Ajouter une/des photos</label>
          <input type="file" className="form-control photos" name='photos[]' multiple id="photos" placeholder="photos"/>
          <button type="button" className="btn btn-primary" onClick={add_photos}>Ajouter</button>
        </form>
    </div>
  )
}
export default UpdateArticle