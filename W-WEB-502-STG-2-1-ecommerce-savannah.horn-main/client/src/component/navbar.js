import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";

function Navbar() {
  return (
    <div className="Home">
      <nav className="navbar navbar-expand-md navbar-dark bg-body-tertiary">
        <div className="container">
          <div className="navbar-center d-flex justify-content-center align-items-center">
            <Link to="/" className="navbar-brand">
              HOME
            </Link>
            <Link to="/collection/24" className="navbar-brand">
              PRODUCTS
            </Link>
            <Link className="navbar-brand">ABOUT US</Link>
            {localStorage['is_admin'] ? 
            <Link
              to={"/admin"}
              className="navbar-brand"
            >Admin</Link>
            : null
            }
          </div>
          <div className="navbar-right d-flex align-items-center">
            <form className="d-flex" role="search">
              <input
                className="form-control me-2 rounded-pill"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
            </form>
            {localStorage["token"] ?
            <Link
              to={"/profile"}
              className="navbar-brand"
            >
              <img src="/Assets/userIcon3.png" alt="logo" width="40px" />
            </Link>
            :
            <Link
              to={"/login"}
              className="navbar-brand"
            >
              <img src="/Assets/userIcon3.png" alt="logo" width="40px" />
            </Link>
            }
            {localStorage["token"] ? 
            <Link
              to={"/logout"}
              className="navbar-brand"
            >Logout</Link>
            :
            null
          }
            <Link to="/shoppingCart" className="navbar-brand">
              CART
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
