import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import ShoppingCart from "./ShoppingCartClass";
import ShoppingCartItem from "./ShoppingCartPageItem";
import { Link } from "react-router-dom";

function ShoppingCartPage() {
  const [shoppingCart, setshoppingCart] = useState(ShoppingCart.getContent());
  
  return (
    <div>
      <Navbar />
      <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
          <h1 class="mt-4">SHOPPING CART :</h1>

          {shoppingCart?.map((article) => (
            <ShoppingCartItem
              key={article.itemId}
              id={article.itemId}
              quantity={article.quantity}
              format ={article.format}
              setCart={setshoppingCart}
            />
          ))}

          {shoppingCart == "" ? (
            <h3> Your cart is empty ... :c</h3>
          ) : (
            <Link className="btn btn-lg btn-dark" to="/checkout">
              Checkout
            </Link>
          )}
        </div>
      </div>
      <div class="col-2"></div>
    </div>
  );
}

export default ShoppingCartPage;
