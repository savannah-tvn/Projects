import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import Admin from "./component/Admin/Admin";
import AdminUser from "./component/Admin/AdminUser";
import AdminStock from "./component/Admin/AdminStock";
import AdminInfo from "./component/Admin/AdminIfo";
import ExportExcel from "./component/Admin/exportExcel";
import AdminCategorie from "./component/Admin/AdminCategorie";
import AdminCollection from "./component/Admin/AdminCollection";
import AdminArticle from "./component/Admin/AdminArticle";
import UpdateCategorie from "./component/Admin/UpdateCategorie";
import AdminAddCategorie from "./component/Admin/AdminAddCategorie";
import UpdateCollection from "./component/Admin/UpdateCollection";
import AdminAddCollection from "./component/Admin/AdminAddCollection";
import UpdateArticle from "./component/Admin/UpdateArticle";
import AdminAddArticle from "./component/Admin/AdminAddArticle";
import UpdateUser from "./component/Admin/UpdateUser";
import logo from "./logo.svg";
import Register from "./component/Register";
import Login from "./component/Login";
import Article from "./component/Articles";
import Carroussel from "./component/carroussel";
import Collection from "./component/Collection";
import AllArticles from "./component/AllArticles";
import UserPage from "./component/UserPage";
import Logout from "./component/Logout";
import ShoppingCartPage from "./component/ShoppingCartPage";
import CheckoutPage from "./component/CheckoutPage";

function App() {
  const articlesData = [];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminUser" element={<AdminUser />} />
        <Route path="/adminStock" element={<AdminStock />} />
        <Route
          path="/adminInfo"
          element={<AdminInfo articles={articlesData} />}
        />
        <Route path="/adminCategorie" element={<AdminCategorie />} />
        <Route path="/AdminAddCategorie" element={<AdminAddCategorie />} />
        <Route path="/updateCategorie/:id" element={<UpdateCategorie />} />
        <Route path="/adminCollection" element={<AdminCollection />} />
        <Route path="/AdminAddCollection" element={<AdminAddCollection />} />
        <Route path="/updateCollection/:id" element={<UpdateCollection />} />
        <Route path="/adminArticle" element={<AdminArticle />} />
        <Route path="/updateArticle/:id" element={<UpdateArticle />} />
        <Route
          path="/AdminAddArticle"
          element={<AdminAddArticle articles={articlesData} />}
        />
        <Route path="/updateUser/:id" element={<UpdateUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/AllArticles/:id" element={<AllArticles />} />
        <Route path="/Collection/:id" element={<Collection />} />
        <Route path="/Articles/:id" element={<Article />} />
        <Route path="/Carroussel" element={<Carroussel />} />
        <Route path="/shoppingCart" element={<ShoppingCartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<UserPage />} />
        <Route path='/logout' element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
