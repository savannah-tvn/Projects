import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import "bootstrap/dist/css/bootstrap.min.css";
import { Offcanvas } from "react-bootstrap";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./Home.css";
import Navbar from "./navbar";
import Footer from "./footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Home() {
  const [showOffcanvas, setShowOffcanvas] = React.useState(false);
  const [categorie, setCategorie] = useState("");
  const [categorie_cache, setCategorie_cache] = useState({ null: "a chier" });
  const ip = process.env.REACT_APP_IP

  const navigate = useNavigate();

  // recupere toutes les categories
  function get_categorie() {
    axios.get(ip+"/api/getAllCategorie").then((response) => {
      if (response.status == 200) {
        setCategorie(response.data)
        setCategorie_cache(response.data)
      }
    });
  }
  useEffect(() => {
    get_categorie();
  }, [])
  // navigue vers la collection selectionné
  function go_to_article(event) {
    const categorie_id = event.target.id;
    navigate("/collection/" + categorie_id);
  }
  // recherche une categorie precise
  function search_info(event) {
    setTimeout(() => {
      const search = event.target.value;
      if (search) {
        if (categorie_cache != { null: "a chier" }) {
          const filteredData = categorie_cache.filter((entry) => {
            const valuesToCheck = Object.values(entry).join(" ").toLowerCase();
            const searchTermLowerCase = search.toLowerCase();
            return valuesToCheck.includes(searchTermLowerCase);
          });
          setCategorie(filteredData);
        } else {
          const filteredData = categorie.filter((entry) => {
            const valuesToCheck = Object.values(entry).join(" ").toLowerCase();
            const searchTermLowerCase = search.toLowerCase();
            return valuesToCheck.includes(searchTermLowerCase);
          });
          setCategorie(filteredData);
        }
      } else {
        setCategorie(categorie_cache);
      }
    }, 50);
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
      <div>
        <header className="Home-header d-flex justify-content-center align-items-center flex-wrap">
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 66, fontWeight: 'bold', color: "#04164D" }} className="animate-charcter">The world best materials</h1>
          <img src='/Assets/logoweb4you-2.png' alt="logo-web4you" style={{ width: 360 }} className='rotate' />
          <img src='/Assets/title-logoweb4you.png' alt="logo-web4you" style={{ width: 280 }} />
          <p style={{ fontSize: 28, color: "purple" }}>We have the best products for you.</p>

          <ScrollLink to="card-lg" smooth={true} duration={1200} offset={-100}>
            <button
              type="submit"
              className="btn btn-outline-light rounded-pill px-4 py-2 my-3 mx-auto font-weight-normal shadow hover:shadow-none border text-uppercase w-75 "
              style={{ fontWeight: "bold" }}
            >
              <span className="text-black">SHOP NOW</span>
            </button>
          </ScrollLink>
          <div className="container-home">
            <div className="row">
                <input onChange={search_info} type='text' />
            <div className="position-relative">
                <i className="fas fa-search search-icon"></i>
              </div>

              {categorie.length == 0
                ? null
                : categorie.map((element) => (
                  <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div className="card-wrapper">
                      <div className="card-lg">
                        {element.urlPhoto ? (
                          <img
                            src={
                              ip+"/storage/" +
                              element.urlPhoto
                            }
                            className="card-img-top"
                            alt={element.name}
                            style={{ maxWidth: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <div></div>
                        )}
                        <div className="card-body">
                          <a
                            onClick={go_to_article}
                            id={element.id}
                            className="btn btn-primary btn-dark d-flex justify-content-center align-items-center"
                            style={{ fontSize: 12 }}
                          >
                            {element.name}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </header>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
