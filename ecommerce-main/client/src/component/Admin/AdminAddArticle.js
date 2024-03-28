import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Admin.css";
import NavAdmin from "./NavAdmin";
import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from 'xlsx';

const AdminAddArticle = ({  }) => {
  // console.log("updateArticleList prop:", updateArticleList);
  const navigate = useNavigate();
  const [relation_name, set_relation_name] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [article, set_articles] = useState('');

  const ip = process.env.REACT_APP_IP

  // fonction qui recupere les articles
  function get_stock() {
    axios.get(ip+"/api/getAllArticle").then((response) => {
      set_articles(response.data);
    });
  }

  // fonction qui supprime un article
  async function delete_current_article(id){
   await axios.post(ip+"/api/deleteArticle/"+id).then((response) => {
        if(response.status == 200) {
            console.log("article supprimé")
        }
    })
    
  }
  useEffect(() => {
    if(!localStorage['is_admin']){
      navigate("/")
    }
    get_name_relation();
    get_stock();
  }, []);
  
  // recupere toutes les collections
  function get_name_relation() {
    axios
    .get(ip+"/api/getAllCollection/")
    .then((response) => {
      set_relation_name(response.data);
    });
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImport = async () => {
    // console.log(updateArticleList);
    if (!selectedFile) {
      return;
    }
    try {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; 
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log(sheetData);
        //Suppression de tous les articles existants pour éviter d'avoir un doublon ou CODE 429 Trop de requêtess..
        await Promise.all(article.map(async (currentArticle) => {
          await delete_current_article(currentArticle.id);
        }));
        //Ajout des nuoveaux articles via Excel (xlsx)
        await Promise.all(sheetData.map(async (newArticleData) => {
          await axios.post("http://127.0.0.1:8000/api/addArticleEx", newArticleData);
        }));
        
        console.log("Import successful");
        navigate('/adminarticle');
      };

      fileReader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.log('Error importing data:', error);
    }
  };


  // creer un article
  function create_article() {
    const inputData = new FormData();
    
    // Accéder aux fichiers sélectionnés dans l'input type="file"
    const photos = document.querySelector(".photos").files;
    const inputs = document.querySelectorAll(".form-group > input");
    const relation_name = document.querySelector(".relation_name").value;
    
    inputs.forEach((element) => {
      if (element.value && element.id !== "photos") {
        inputData.append(element.id, element.value);
      }
    });
    
    // Ajouter les photos individuellement à l'objet FormData avec des crochets pour créer un tableau
    for (let i = 0; i < photos.length; i++) {
      inputData.append("photos[]", photos[i]);
      console.log(photos[i]);
    }
    if (relation_name == "Choissiez une collection") {
      alert("Veuillez choisir une collection");
    } else {
      inputData.append("collection", relation_name);
      
      // for (let index = 0; index < 15; index++) {
        axios
        .post(ip+"/api/addArticle/", inputData)
        .then((response) => {
          if (response.data.status == true) {
            alert(response.data.message);
            navigate("/adminarticle");
          } else {
            console.log(response.data);
          }
        });
        
        // }
      }
    }

    return (
    <div className="second-body">
      <NavAdmin />
      <div className="second_header container-fluid">
        <img src="/Admin/images/logo_user.png" alt="Logo" />
        <p>Add article</p>
      </div>
      <form encType="multipart/form-data" className="addarticle">
        <div className="form-group">
          <label htmlFor="description">description</label>
          <input
            type="text"
            className="form-control description"
            id="description"
            placeholder="description"
          />
        </div>
        <div className="form-group">
          <label htmlFor="caracteristique">caracteristique</label>
          <input
            type="text"
            className="form-control"
            id="caracteristique"
            placeholder="caracteristique"
          />
        </div>
        <div className="form-group">
          <label htmlFor="collection_name">collection_name</label>
          <select
            className="form-select relation_name"
            aria-label="Default select example"
          >
            <option>Choissiez une collection</option>
            {relation_name.length ? (
              relation_name.map((element) => <option>{element.name}</option>)
            ) : (
              <option>Aucunes collection existante</option>
            )}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="prix">prix</label>
          <input
            type="text"
            className="form-control"
            id="prix"
            placeholder="prix"
          />
        </div>
        <div className="form-group">
          <label htmlFor="poids">poids</label>
          <input
            type="text"
            className="form-control"
            id="poids"
            placeholder="poids"
          />
        </div>
        <div className="form-group">
          <label htmlFor="couleur">couleur</label>
          <input
            type="text"
            className="form-control"
            id="couleur"
            placeholder="couleur"
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">stock bobine</label>
          <input
            type="text"
            className="form-control"
            id="stock_bobine"
            placeholder="stock bobine"
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">stock bande</label>
          <input
            type="text"
            className="form-control"
            id="stock_bande"
            placeholder="stock bande"
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">stock vrac</label>
          <input
            type="text"
            className="form-control"
            id="stock_vrac"
            placeholder="stock vrac"
          />
        </div>
        <div className="form-group">
          <label htmlFor="promotion">promotion</label>
          <input
            type="text"
            className="form-control"
            id="promotion"
            placeholder="promotion"
          />
        </div>
        <div className="form-group">
          <label htmlFor="photos">photos</label>
          <input
            type="file"
            className="form-control photos"
            name="photos[]"
            multiple
            id="photos"
            placeholder="photos"
          />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={create_article}
        >
          Creer un article
        </button>
      </form>
        <div className='importExcel'>
        <h1>Import Excel Data</h1>
        <input type='file' onChange={handleFileChange} />
        <button type="button" onClick={handleImport}>Import excel</button>
      </div>
    </div>
  );
};

export default AdminAddArticle;
