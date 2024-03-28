import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import NavAdmin from './NavAdmin';

import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


const AdminStock = () => {
  const navigate = useNavigate();
  const [rediriger, set_rediriger] = useState("admin")
  const [articles, set_articles] = useState('')
  const ip = process.env.REACT_APP_IP

  // recupere les articles
  function get_stock(){
      axios.get(ip+"/api/getAllArticle").then((response) => {
      set_articles(response.data);
    })
  }
  useEffect(() => {
    if(!localStorage['is_admin']){
      navigate("/")
    }
    get_stock();
  }, [])
  // redirige vers categorie
  function redirection_categorie(){
    set_rediriger("categorie")
  }
  // redirige vers collection
  function redirection_collection(){
    set_rediriger("collection")
  }
  // redirige vers article
  function redirection_article(){
    set_rediriger("article")
  }
  if(rediriger =="categorie"){
    navigate('/adminCategorie')
  }
  if(rediriger =="collection"){
    navigate('/adminCollection')
  }
  if(rediriger =="article"){
    navigate('/adminArticle')
  }
  return (
    <div>
      < NavAdmin/>
    <div className='second_header container-fluid'>
      <img src='./Admin/images/logo_user.png'></img>
      <p>Stock administration</p>
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
    <div className='second_main container-fluid'>
      <div className='card card_user col-3' onClick={redirection_categorie}>
        <p className='display-6'>Categorie management</p>
      </div>
      <div className='card card_stock col-3' onClick={redirection_collection}>
        <p className='display-6'>Collection management</p>
      </div>
      <div className='card card_info col-3' onClick={redirection_article}>
        <p className='display-6'>Article management</p>
      </div>
    </div>
  </div>
  )
}

export default AdminStock