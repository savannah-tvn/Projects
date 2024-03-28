import React from 'react';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './navAdmin.css';

function Navbar() {
  
  return (
    <div className="Home-admin">
      <nav className="navbar navbar-expand-md navbar-dark bg-body-tertiary">
        <div className="container">
          <div className="navbar-center d-flex justify-content-center align-items-center">
            <Link to="/adminUser" className="navbar-brand">USER MANAGEMENT</Link>
            <Link to="/adminStock" className="navbar-brand">STOCK MANAGEMENT</Link>
            <Link to="/adminInfo" className="navbar-brand">INFORMATIONS MANAGEMENT</Link>
          </div>
        </div>
      </nav>  
    </div>
  );
}

export default Navbar;
