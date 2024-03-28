import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Offcanvas } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from './navbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function Collection() {
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = React.useState(false);
  const [categorie, setCategorie] = useState('');
  const [categorie_cache, setCategorie_cache] = useState({ null: "a chier" });
  const ip = process.env.REACT_APP_IP

  const { id } = useParams();

  // recupere une collection depuis l'id dune categorie
  function get_categorie() {
    axios.get(ip+"/api/getAllCollectionByCategorie/" + id).then((response) => {
      if (response.status == 200) {
        setCategorie(response.data)
        setCategorie_cache(response.data)
      }
    })
  }
  // recherche une collection precise
  function search_info(event) {
    setTimeout(() => {
      const search = event.target.value
      if (search) {
        if (categorie_cache != { null: "a chier" }) {
          const filteredData = categorie_cache.filter(entry => {
            const valuesToCheck = Object.values(entry).join(' ').toLowerCase();
            const searchTermLowerCase = search.toLowerCase();
            return valuesToCheck.includes(searchTermLowerCase);
          });
          setCategorie(filteredData);
        }
        else {
          const filteredData = categorie.filter(entry => {
            const valuesToCheck = Object.values(entry).join(' ').toLowerCase();
            const searchTermLowerCase = search.toLowerCase();
            return valuesToCheck.includes(searchTermLowerCase);
          });
          setCategorie(filteredData);
        }
      }
      else {
        setCategorie(categorie_cache)
      }

    }, 50);
  }
  useEffect(() => {
    get_categorie();
  }, [])

  // navigue vers tous les articles d'une collection
  function go_to_article(event) {
    const collection_id = event.target.id
    navigate('/AllArticles/' + collection_id)
  }

  return (
    <div className="Home">

      < Navbar />

      <button variant="dark" className="rounded-pill px-3 py-3 my-3 shadow hover:shadow-none text-uppercase" onClick={() => setShowOffcanvas(true)} 
      style={{ 
        backgroundColor: "black", 
        borderRadius: '20',
        color: "white", 
        padding: 15, 
        border: "none", 
        borderRadius: 5, 
        margin: 5, fontWeight: "bold" }}>
        - ORDERS -
      </button>
      <div className="offcanva">
        <Offcanvas
          show={showOffcanvas}
          onHide={() => setShowOffcanvas(false)}
          placement="start"
          scroll={false}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              style={{ color: "black", fontWeight: "bold", marginTop: "15%" }}
            >
              ORDERS
            </Offcanvas.Title>
          </Offcanvas.Header>
          <div className="canva-link">
            <Offcanvas.Body>
              <Link to="/profile"
                style={{
                  fontSize: 20,
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Track Order
              </Link>
              <br></br>
              <br></br>
              <Link to="/profile"
                style={{
                  fontSize: 20,
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Order History
              </Link>
            </Offcanvas.Body>
          </div>
        </Offcanvas>
      </div>


      <header className="Home-header d-flex justify-content-center align-items-center flex-wrap">
        <h1 style={{ margin: 80 }}>NOS PRODUITS</h1>
        <div className='containter-fluid'>
          <div className="row">
            <input onChange={search_info} type='text' />
            <div className="position-relative">
              <i className="fas fa-search search-icon"></i>
            </div>
            <div className='card-container'>
              {
                categorie.length == 0 ? null

                  :
                  categorie.map(element => (

                    <div id={element.id} className='card card_user col-md-10 card_collection' onClick={go_to_article} style={{ margin: 40}}>
                      <p id={element.id} className='pp display-6'>{element.name}</p>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      </header>

      <footer>
        <p>&copy; {new Date().getFullYear()} -
          All rights reserved..Sorry bro</p>
        <div className='footer-items'>
          <img src='/Assets/348.jpg' alt='social Icons fotter' style={{ width: 120 }} />
        </div>
        <p><img src='/Assets/support.png' alt='icon support' style={{ width: 30 }} /> Help & Support</p>
      </footer>

    </div>
  );
}

export default Collection;
