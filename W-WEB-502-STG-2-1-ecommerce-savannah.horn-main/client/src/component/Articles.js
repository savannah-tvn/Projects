import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import "./articles.css";
import Footer from "./footer";
import Slider from "react-slick";
import ShoppingCart from "./ShoppingCartClass";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carroussel.css";
import DownloadButton from "./DownloadButton";
import { useParams } from "react-router-dom";

function Article() {
  const ip = process.env.REACT_APP_IP

  const { id } = useParams();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <button>Previous</button>,
    nextArrow: <button>Next</button>,
  };
  const [data, setData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState();
  const [selectedFormat, setSelectedFormat] = useState("");
  const [stock_actuel, setstock_actuel] = useState("");

  // fonction qui gere le system de format et de prix
  const handleChangeFormat = (event) => {
    setSelectedFormat(event.target.value);
    switch (event.target.value) {
      case "Vrac":
        setstock_actuel(data.article.stock_vrac)
        document.querySelector(".my-1").value = 1
        setTotalPrice(1)
        break;
      case "Bande":
        setstock_actuel(data.article.stock_bande)
        document.querySelector(".my-1").value = 1
        setTotalPrice(45)
        break;
      case "Bobine":
      setstock_actuel(data.article.stock_bobine)
      document.querySelector(".my-1").value = 1
      setTotalPrice(90)

      default:
        break;
    }
    


  };

  // permets d'ajouter un article au panier
  const addArticle = () => {
    ShoppingCart.addItemToCart(id, quantity, selectedFormat);
  };

  // fonction qui met a jour le prix au fur et a mesure
  function update_price(event) {
    const quantity = event.target.value
    const format = selectedFormat;

    switch (format) {
      case "Vrac":
        if(quantity <= data.article.stock_vrac) {
          setQuantity(quantity)
          calcul(format, quantity)
        }
        else {
          document.querySelector(".my-1").value = quantity-1
        }
        break;
      case "Bande":
        if(quantity <= data.article.stock_bande) {
          setQuantity(quantity)
          calcul(format, quantity)
        }
        else {
          document.querySelector(".my-1").value = quantity-1
        }
        break;
      case "Bobine":
        if(quantity <= data.article.stock_bobine) {
          setQuantity(quantity)
          calcul(format, quantity)

        }
        else {
          document.querySelector(".my-1").value = quantity-1
        }
      default:
        break;
    }

  }

  // fonction qui calcule le prix en fonction du format et de la quantité
  function calcul(format, quantity) {
    const prix = data.article.prix

    if (format == "Vrac") {
      const price = quantity * prix;


      setTotalPrice(price)
    }
    else if (format == "Bobine") {
      const price = quantity * 100 * prix - (quantity * 100 * prix) * 10 / 100;
      setTotalPrice(price)
    }
    else if (format == "Bande") {
      const price = quantity * 50 * prix - (quantity * 50 * prix) * 10 / 100;
      setTotalPrice(price)
    }
  }
  useEffect(() => {
    fetch(ip+"/api/getArticleId/" + id)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        if(data.article.stock_vrac> 0){
          setstock_actuel(data.article.stock_vrac)
          setSelectedFormat("Vrac")
          setTotalPrice(1)
        }
        else if (data.article.stock_bande> 0){
          setstock_actuel(data.article.stock_bande)
          setSelectedFormat("Bande")
          setTotalPrice(45)
        }
        else if (data.article.stock_bobine> 0){
          setstock_actuel(data.article.stock_bobine)
          setSelectedFormat("Bobine")
          setTotalPrice(90)
        }
      })
      .catch((error) => console.error(error));
  }, []);
  if(!data.article) {
    return null
  }
  return (
    <>
      <Navbar />
      
      <div className="container_product">
        <div className="img_article">
          {data.photos ?
            <Slider {...settings}>
              {data.photos.map(element => (
                <div>
                  <img src={ip+"/storage/" + element.urlPhoto} alt="Photo de l'article" />
                </div>
              ))}
            </Slider>
            : <p>Aucun Visuel Produit</p>}
        </div>
        <div className="details">
          <h1 className="title_product">
            {data.article && data.article.description}
          </h1>
          <ul>
            <li>
              Collection :{" "}
              <strong className="important">
                {data.article && data.article.collection_name}
              </strong>
            </li>
            <li>
              Poids :{" "}
              <strong className="important">
                {data.article && data.article.poids}
              </strong>
            </li>
            <li>
              Couleur :{" "}
              <strong className="important">
                {data.article && data.article.couleur}
              </strong>
            </li>
            <li>
              Description :{" "}
              <strong className="important">
                {data.article && data.article.caracteristique}
              </strong>
            </li>
            <li>
              Stock :{" "}
              <strong className="important">

                {stock_actuel}
              </strong>
            </li>
          <DownloadButton />


            {data.article && data.article.stock_bobine > 0 || data.article.stock_bande > 0 || data.article.stock_vrac > 0 ? 
              <div>
              <li>Format :</li>
              <select value={selectedFormat} onChange={handleChangeFormat}>
                {data.article.stock_vrac > 0 ?
                <option value="Vrac">Vrac</option>
                : null
                }
                {data.article.stock_bande > 0 ?
                <option value="Bande">Bande</option>
                : null
                }
                {data.article.stock_bobine > 0 ? 
                <option value="Bobine">Bobine</option>
                :null }
              </select>
              </div> : null}
              
            </ul>
            {data.article.stock_bobine > 0 || data.article.stock_bande > 0 || data.article.stock_vrac > 0 ? 

          <div className="button">
            <input
              class="my-1"
              type="number"
              defaultValue={1}
              onChange={update_price}
              min={0}
            ></input>
            <button
              type="button"
              class="btn btn-lg btn-dark btnprice"
              onClick={addArticle}
            >
              {totalPrice != null && totalPrice} €
            </button>
            <img id="cb" src="/Assets/cb.png" alt="..." />
          </div> : null}


        </div>
      </div>
      <div className="avis">
        <div className="title">
          <h1 className="title">Avis clients : </h1>
          <img src="/Assets/full-star.png" alt=".."></img>
          <img src="/Assets/full-star.png" alt=".."></img>
          <img src="/Assets/full-star.png" alt=".."></img>
          <img src="/Assets/full-star.png" alt=".."></img>
          <img src="/Assets/star_empty.png" alt=".."></img>
        </div>
        <div className="container_avis">
          <div className="background">
            <div className="entete">
              <img
                className="profile"
                src="/Assets/user_avis.png"
                alt=".."
              ></img>
              <p className="name">Jonh Doe</p>
              <p className="note">3.5/5</p>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut, rem
              et, nemo, facilis explicabo iste illum pariatur sapiente harum
              ullam consectetur! Exercitationem ipsa sit aliquam ipsum quam
              facere? Sed, iusto.
            </p>
          </div>
          <div className="background">
            <div className="entete">
              <img
                className="profile"
                src="/Assets/user_avis.png"
                alt=".."
              ></img>
              <p className="name">Jonh Doe</p>
              <p className="note">4/5</p>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut, rem
              et, nemo, facilis explicabo iste illum pariatur sapiente harum
              ullam consectetur! Exercitationem ipsa sit aliquam ipsum quam
              facere? Sed, iusto.
            </p>
          </div>
          <div className="background">
            <div className="entete">
              <img
                className="profile"
                src="/Assets/user_avis.png"
                alt=".."
              ></img>
              <p className="name">Jonh Doe</p>
              <p className="note">4/5</p>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut, rem
              et, nemo, facilis explicabo iste illum pariatur sapiente harum
              ullam consectetur! Exercitationem ipsa sit aliquam ipsum quam
              facere? Sed, iusto.
            </p>
          </div>
          <div className="background">
            <div className="entete">
              <img
                className="profile"
                src="/Assets/user_avis.png"
                alt=".."
              ></img>
              <p className="name">Jonh Doe</p>
              <p className="note">4/5</p>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut, rem
              et, nemo, facilis explicabo iste illum pariatur sapiente harum
              ullam consectetur! Exercitationem ipsa sit aliquam ipsum quam
              facere? Sed, iusto.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Article;
