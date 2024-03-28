import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carroussel.css";


function Carroussel () {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <button>Previous</button>,
    nextArrow: <button>Next</button>
  };

  return (
    <Slider {...settings}>
      <div><img src="./Assets/348.jpg" style={{width: "40px"}}/></div>
      <div><img src="./Assets/amplificateur1.jpg"/></div>
      <div><img src="./Assets/diode1.jpg"/></div>
    </Slider>
  );
}

export default Carroussel;