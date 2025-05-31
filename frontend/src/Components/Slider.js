import React from 'react';
import Slider from 'react-slick';
import "../styles/SlideU.css"; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SliderComponent = () => {
  const settings = {
    dots: true, 
    infinite: true, 
    speed: 500, 
    slidesToShow: 1, 
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 1000, 
    arrows: true, 
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div>
          <img src="https://noticias.udec.cl/wp-content/uploads/2021/05/banderaschileudec-1024x683.jpg" alt="Imagen 1" />
        </div>
        <div>
          <img src="https://noticias.udec.cl/wp-content/uploads/2024/01/Espacio-negativo-UdeC-10-1024x683.jpg" alt="Imagen 2" />
        </div>
        <div>
          <img src="https://noticias.udec.cl/wp-content/uploads/2021/11/campus-udec-2019.jpg" alt="Imagen 3" />
        </div>
      </Slider>
    </div>
  );
};

export default SliderComponent;
