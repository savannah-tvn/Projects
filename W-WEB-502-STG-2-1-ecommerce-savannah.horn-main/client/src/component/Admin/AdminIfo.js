import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import NavAdmin from './NavAdmin';
import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import ExportExcel from './exportExcel';
import data from './articles.json';
import AdminArticle from './AdminArticle'; 


const AdminInfo = () => {

  const [articles, setArticles] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const ip = process.env.REACT_APP_IP
  const navigate = useNavigate();


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  useEffect(() => {
    if(!localStorage['is_admin']){
      navigate("/")
    }
    getArticles();
  }, []);

  const handleImport = async () => {
    try {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; 
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        
       
        await axios.post(ip+"/api/addArticle", sheetData);

        getArticles();
      };

      fileReader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.log('Error importing data:', error);
    }
  };
  // recupere les articles
  function getArticles() {
    axios.get(ip+"/api/getAllArticle").then((response) => {
      setArticles(response.data);
      console.log(response.data);
    });
  }
  return (
    <div>
      <NavAdmin />
      <div className='second_header container-fluid'>
        <img src='./Admin/images/logo_user.png' alt="Logo" />
        <p>Informations management</p>
      </div>
      <div className='exportExcel'>
        <h1>Export informations to Excel</h1>
        <img src="./Assets/excel.png" alt="Excel icon" width={90} /><br />
        <ExportExcel excelData={articles} fileName="Articles Export" />
      </div>
      <div className='importExcel'>
        <h1>Import Excel Data</h1>
        <input type='file' onChange={handleFileChange} />
        <button onClick={handleImport}>Import Data</button>
      </div>
    </div>
  )
}

export default AdminInfo;
