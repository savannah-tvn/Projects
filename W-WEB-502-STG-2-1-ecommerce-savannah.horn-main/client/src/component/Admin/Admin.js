import React, {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import NavAdmin from './NavAdmin';
import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Admins = () => {
  const navigate = useNavigate();
  const [rediriger, set_rediriger] = useState("admin")
  const [articles, set_articles] = useState('')
  const ip = process.env.REACT_APP_IP



  /**
     * Recupere les articles
     * 
     * @author Cedric
     * @version V1.1
  **/
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
  
  // redirection sur composant user
  function redirection_user(){
    set_rediriger("user")
  }
  // redirection sur composant stock
  function redirection_stock(){
    set_rediriger("stock")
  }
  // redirection sur composant info
  function redirection_info(){
    set_rediriger("info")
  }
  if(rediriger =="user"){
    navigate('/adminUser')
  }
  if(rediriger =="stock"){
    navigate('/adminStock')
  }
  if(rediriger =="info"){
    navigate('/adminInfo')
  }
  return (
    <div>
      < NavAdmin/>
      
      <div className='second_header container-fluid'>
        <img src='./Admin/images/logo_user.png'></img>
        <p>Hi Administrator <strong>#username</strong> !</p>
      </div>
      {
         articles ? 
         articles.map((element, index) => {
            if(element.stock_bobine == 0  || element.stock_bobine == null || element.stock_bande == 0  || element.stock_bande == null || element.stock_vrac == 0  || element.stock_vrac == null) {
              return (
                <div class="alert alert-warning" role="alert" key={index}>
                  <p>Un ou des stocks de l'article: {element.description+", id: "+element.id+", est épuisé."}</p>
                </div>
              )
            }
          })
         : null
      }
      <div className='second_main container-fluid'>
        <div className='card card_user col-3' onClick={redirection_user}>
          <p className='display-6'>User management</p>
        </div>
        <div className='card card_stock col-3' onClick={redirection_stock}>
          <p className='display-6'>Stock management</p>
        </div>
        <div className='card card_info col-3' onClick={redirection_info}>
          <p className='display-6'>Informations management</p>
        </div>
      </div>
    </div>
  )
}

export default Admins