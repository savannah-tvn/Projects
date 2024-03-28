import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartPage.css";
import "./articles.css";
import ShoppingCart from "./ShoppingCartClass";
import { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import axios from "axios";

function ShoppingCartPageItem({ id, quantity, format,setCart }) {
  const [articleInfos, setArticleInfos] = useState({});
  const [articlePhotos, setArticlePhotos] = useState({});
  const [originalPrice, setOriginalPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [photoUrl, setPhotoUrl] = useState(0);
  const ip = process.env.REACT_APP_IP

  /**
   * Change la quantité d'un article
   *
   * @author Adrian Wahler adrian.wahler@gmail.com
   * @version V1
   *
   * @params newAmount Nouvelle quantitée
   *
   **/
  const changeQuantity = (newAmount) => {
    ShoppingCart.changeItemQuantity(id, newAmount);

    if (format == "Vrac") {
      if(newAmount >= 50){
        const price = (newAmount * articleInfos.prix) - (newAmount * articleInfos.prix) * 10/100;
        setTotalPrice(price)
      }
      else {
        const price = newAmount * articleInfos.prix;
      setTotalPrice(price)
      }
      
    }
    else if (format == "Bobine") {
      const price = newAmount * 100 * articleInfos.prix - (newAmount * 100 * articleInfos.prix) * 10 / 100;
      setTotalPrice(price)
    }
    else if (format == "Bande") {
      const price = newAmount * 50 * articleInfos.prix - (newAmount * 50 * articleInfos.prix) * 10 / 100;
      setTotalPrice(price)
    }

    setOriginalPrice(articleInfos.prix * newAmount);
  };

  useEffect(() => {
    axios
      .get(ip+"/api/getArticleId/" + id)
      .then(function (response) {
        setArticleInfos(response.data.article);
        setArticlePhotos(response.data.photos);
        console.log(format);
        if (format == "Vrac") {
          if(quantity >= 50){
            const price = (quantity * response.data.article.prix) - (quantity * response.data.article.prix) * 10/100;
            setTotalPrice(price)
          }
          else {
            const price = quantity * response.data.article.prix;
          setTotalPrice(price)
          }
        }
        else if (format == "Bobine") {
          const price = quantity * 100 * response.data.article.prix - (quantity * 100 * response.data.article.prix) * 10 / 100;
          setTotalPrice(price)
        }
        else if (format == "Bande") {
          const price = quantity * 50 * response.data.article.prix - (quantity * 50 * response.data.article.prix) * 10 / 100;
          setTotalPrice(price)
        }

        setOriginalPrice(response.data.article.prix * quantity);

        setPhotoUrl(response.data.photos[0].urlPhoto);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div class="row d-flex align-items-center background">
      <div class="col-4 px-4">
        <img src={ip+"/storage/" + photoUrl}></img>
      </div>
      <div class="col-7 px-4 shoppingCartDescription">
        <h3>ITEM NAME : {articleInfos.description}</h3>
        <p>
          Quantity :{" "}
          <input
            min={0}
            type="number"
            defaultValue={quantity}
            onChange={(e) => {
              changeQuantity(e.target.value);
            }}
          ></input>
        </p>
        <p>
          <span>Total : </span>
          {originalPrice != totalPrice ? <span>{totalPrice + "€"}</span> : ""}
          {(format == "Vrac") && (
            <span
              className={`mx-1 ${originalPrice != totalPrice ? "barred" : ""}`}
            >
              {originalPrice + "€"}{" "}
            </span>
          )}
          {format == "Bande" && (
            <span
              className={`mx-1 barred`}
            >
              {originalPrice * 50 + "€"}{" "}
            </span>
          )}
          {format == "Bobine" && (
            <span
              className={`mx-1 barred`}
            >
              {originalPrice * 100 + "€"}{" "}
            </span>
          )}
        </p>
      </div>
      <div class="col-1">
        <button
          class="shoppingCartXButton"
          onClick={() => {
            ShoppingCart.removeItem(id);
            setCart(ShoppingCart.getContent());
          }}
        >
          x
        </button>
      </div>
    </div>
  );
}

export default ShoppingCartPageItem;
