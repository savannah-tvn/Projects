import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const ip = process.env.REACT_APP_IP
  const navigate = useNavigate();

        
    useEffect(()=>{
        if(localStorage['token']){
            axios
          .post(ip+"/api/auth/logout", {},{
            headers: {
              Authorization: "Bearer " + localStorage["token"],
            },
          })
          .then((res) => {
            if(res.data.status) {
                if(localStorage['is_admin']) {
                    localStorage.removeItem("is_admin");
                }
                if(localStorage['token']){
                    localStorage.removeItem('token');
                    navigate('/')
                }
            }
          });
        }
        navigate("/")
    },[])


  return (
    <div><p>Logout</p></div>
  )
}

export default Logout


/*

*/