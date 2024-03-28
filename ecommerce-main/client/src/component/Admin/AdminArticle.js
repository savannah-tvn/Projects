import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import NavAdmin from './NavAdmin';
import ExportExcel from './exportExcel';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AdminArticle = () => {
  const navigate = useNavigate();

  const [article, set_article] = useState('');
  const [article_cache, set_article_cache] = useState('');
  const [articles, set_articles] = useState('');
  const ip = process.env.REACT_APP_IP

  // recupere les articles
  function get_stock() {
    axios.get(ip+"/api/getAllArticle").then((response) => {
      set_articles(response.data);
      console.log(response.data);
    });
  }
    // recherche un article
    function search_article() {
      let search = document.querySelector(".search_input").value;
  
      if (search) {
        if (article_cache) {
          const filteredData = article_cache.filter(entry => {
            const valuesToCheck = Object.values(entry).join(' ').toLowerCase();
            const searchTermLowerCase = search.toLowerCase();
            return valuesToCheck.includes(searchTermLowerCase);
          });
          set_article(filteredData);
        }
        else {
          const filteredData = article.filter(entry => {
            const valuesToCheck = Object.values(entry).join(' ').toLowerCase();
            const searchTermLowerCase = search.toLowerCase();
            return valuesToCheck.includes(searchTermLowerCase);
          });
          set_article(filteredData);
        }
      }
      else {
        set_article(article_cache)
      }
    }

    // creer un article
    function add_article(){
        navigate('/AdminAddarticle');

    }

    // supprime un article
    function delete_article(event){
      const article_id = event.target.id
      // lancer suppresions
      axios.post(ip+"/api/deleteArticle/"+article_id).then((response) => {
        if(response.status == 200) {
            alert("article supprimé")
            get_info();
        }
        else {
            alert("Une erreur est survenu")
            console.log(response);
        }
      })
      
    }

    // met a jour un article
    function update_article(event){
      const article_id = event.target.id
      // lancer update
      navigate('/updatearticle/'+article_id)
  
    }
    // recupere les articles
    function get_info(){
        axios.get(ip+"/api/getAllArticle").then((response) => {
          console.log(response.data)
        set_article(response.data);
        set_article_cache(response.data);
  
      })
    }
  
    useEffect(() => {
      if(!localStorage['is_admin']){
      navigate("/")
    }
      get_info();
      get_stock();
  
    }, [])
    if (!article) {
      return null;
    }
  return (
    <div>
      <NavAdmin/>
    <div className='second_header container-fluid'>
      <img src='./Admin/images/logo_user.png' alt="Logo" />
      <p>article management</p>
    </div>
    {
      articles ? 
      articles.map((element, index) => (
        element.stock == 0 ?
              <div class="alert alert-warning" role="alert" key={index}>
                <p>Le stock de l'article: {element.description+", id: "+element.id+", est épuisé."}</p>
            </div>
            : null
         ))
         : null
      }
    <div className='cotainer-fluid'>
    <button type='button' className="btn btn-primary" onClick={add_article}>Ajouter une article</button>
      <div className='row search_form'>
        <form className='col-3'>
          <input type='search' className='search_input input-group-text' placeholder='Rechercher une article'></input>
          <button type='button' className='btn btn-dark' onClick={search_article}>Search</button>
        </form>
      </div>
    </div>
    <div className='container-fluid'>
      <table className="table">
        <thead>
          <tr>
            <th scope="col-1">Id</th>
            <th scope="col-1">Description</th>
            <th scope="col-1">Caracteristiques</th>
            <th scope="col-1">Collection</th>
            <th scope="col-1">Prix</th>
            <th scope="col-1">Poids</th>
            <th scope="col-1">Couleur</th>
            <th scope="col-1">Stock bobine</th>
            <th scope="col-1">Stock bande</th>
            <th scope="col-1">Stock vrac</th>
            <th scope="col-1">Stock total</th>
            <th scope="col-1">Promotion</th>
          </tr>
        </thead>
        <tbody>
          {
            article.map(element => (
              <tr key={element.id}>
                <th scope="row">{element.id}</th>
                <td>{element.description}</td>
                <td>{element.caracteristique}</td>
                <td>{element.collection_name}</td>
                <td>{element.prix}</td>
                <td>{element.poids}</td>
                <td>{element.couleur}</td>
                <td>{element.stock_bobine*1+ " ("+element.stock_bobine*100+" unités)"}</td>
                <td>{element.stock_bande*1+ " ("+element.stock_bande*10+" unités)"}</td>
                <td>{element.stock_vrac*1 + " unités"}</td>
                <td>{element.stock_bobine*100+element.stock_bande*10+element.stock_vrac+ " unités"}</td>
                <td>{element.promotion*1+" %"}</td>
                <td className='p_modif'><p id={element.id} onClick={update_article}>modifier</p> - <p onClick={delete_article} id={element.id}>supprimer</p></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    <ExportExcel excelData={articles} fileName="Articles Export" />
    </div>
  </div>
  );
}

export default AdminArticle