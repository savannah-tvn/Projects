import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Link as ScrollLink } from 'react-scroll';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Offcanvas } from 'react-bootstrap';
import './Home.css';
import Navbar from './navbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function AllArticles() {
  const ip = process.env.REACT_APP_IP
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = React.useState(false);
  const [categorie, setCategorie] = useState('');
  const [categorie_cache, setCategorie_cache] = useState({ null: "a chier" });

  const { id } = useParams();

  // recherche une categorie
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
  // fonction qui filtre les types de stocks
  function filtre(event) {
    if(event.target.value == "stock: bande"){
      let tab = [];
      categorie_cache.map(element => {
        if(element.stock_bande !== 0 && element.stock_bande !== null ) {
          tab.push(element)
        }
      });
      setCategorie(tab)
    }
    else if (event.target.value == "stock: bobine") {
      let tab = [];
      categorie_cache.map(element => {
        if(element.stock_bobine !== 0 && element.stock_bobine !== null ) {
          tab.push(element)
        }
      });
      setCategorie(tab)
    }
    else if (event.target.value == "stock: vrac") {
      let tab = [];
      categorie_cache.map(element => {
        if(element.stock_vrac !== 0 && element.stock_vrac !== null ) {
          tab.push(element)
        }
      });
      setCategorie(tab)
    }
    else if (event.target.value == "Filtres") {
      setCategorie(categorie_cache)
    }
  }
  // recupere les articles d'une collection
  function get_categorie() {
    axios.get(ip+"/api/getAllArticleByCollection/" + id).then((response) => {
      if (response.status == 200) {
        setCategorie(response.data)
        setCategorie_cache(response.data)
      }
    })
  }
  useEffect(() => {
    get_categorie();
  }, [])
  // redirige vers larticle selectionné
  function go_to_article(event) {
    const collection_id = event.target.id
    navigate('/Articles/' + collection_id)
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
          <h1 style={{ marginBottom: 25 }}>Nos produits</h1>
      <select className='filtre' onChange={filtre} style={{ margin: 15, padding: 10, fontWeight: "bold", border: "3px solid black", borderRadius: 10 }}>
        <option>Filtres</option>
        <option>stock: bobine</option>
        <option>stock: bande</option>
        <option>stock: vrac</option>
      </select>
      <input className="search-product" onChange={search_info} type='text' style={{ width: "70%", margin: 5 }}></input>
          <div className="container hover:shadow-none text-uppercase" style={{ margin: 15, borderRadius: 15, width: "100%", height: "100%", display: "grid" }}>
            <div className="row" style={{ marginTop: 10, padding: 0 }}>
              {
                categorie.length == 0 ? null

                :
                categorie.map(element => (
                  <div id={element.id} className="col-sm-6 col-md-4 col-lg-3 mb-4" onClick={go_to_article}>
                    <div id={element.id} className="card-wrapper">
                      <div id={element.id} className="card-lg" >
                        <p id={element.id} className="pp btn btn-primary btn-dark d-flex justify-content-center align-items-center" style={{ fontSize: 15, fontWeight: "bold" }}>{element.description}</p>
                        {
                          element.promotion ?
                            <p id={element.id} className="ppp btn btn-primary btn-dark d-flex justify-content-center align-items-center" style={{ fontSize: 15, fontWeight: "bold", padding: 15 }}>{"PROMO "+element.promotion+"%"}</p>
                          
                          :
                          null
                        }
                        {element.urlPhoto ?
                          <img id={element.id} src={ip+'/storage/' + element.urlPhoto} className="card-img-top" alt={element.name} style={{ maxWidth: '100%', objectFit: 'cover', padding: 15 }} />
                          : <div id={element.id} ></div>}
                        <div id={element.id} className="card-body">
                          {
                            element.promotion ?
                              <p id={element.id} className="ppp btn btn-primary btn-dark d-flex justify-content-center align-items-center" style={{ fontSize: 15, fontWeight: "bold", padding: 15 }}>{element.prix * element.promotion / 100 + " euros"}</p>

                              :
                              <a id={element.id} className="btn btn-primary btn-dark d-flex justify-content-center align-items-center" style={{ fontSize: 15, fontWeight: "bold", padding: 15 }}>{element.prix + " euros"}</a>

                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))

            }

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

export default AllArticles;
