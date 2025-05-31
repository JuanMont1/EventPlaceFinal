import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaGraduationCap,
  FaTheaterMasks,
  FaComments,
  FaYoutube,
} from "react-icons/fa";
import "../../styles/VideoPromoSection.css";  

const VideoPromoSection = () => (
  <section className="video-promo-section bg-gradient-to-br from-blue-600 to-purple-700 py-24">
    <Container>
      <Row className="justify-content-center text-center text-white mb-16">
        <Col lg={8}>
          <h2 className="text-5xl font-bold mb-6 leading-tight text-shadow-lg">
            Explora Nuestros Eventos en YouTube
          </h2>
          <p className="text-xl mb-10 opacity-90 leading-relaxed">
            Sumérgete en el fascinante mundo de eventos de la Universidad de
            Cundinamarca. Desde conferencias académicas hasta presentaciones
            culturales, todo está a tu alcance.
          </p>
        </Col>
      </Row>
      <Row className="justify-content-center mb-16">
        <Col md={4} className="mb-8 mb-md-0">
          <div className="feature-card bg-white bg-opacity-10 p-6 rounded-lg text-center text-white">
            <FaGraduationCap className="text-5xl mb-4 text-yellow-300 mx-auto" />
            <h3 className="text-2xl font-semibold mb-2">
              Conferencias académicas en vivo
            </h3>
            <p className="opacity-80">
              Amplía tus conocimientos con expertos en diversas áreas.
            </p>
          </div>
        </Col>
        <Col md={4} className="mb-8 mb-md-0">
          <div className="feature-card bg-white bg-opacity-10 p-6 rounded-lg text-center text-white">
            <FaTheaterMasks className="text-5xl mb-4 text-yellow-300 mx-auto" />
            <h3 className="text-2xl font-semibold mb-2">
              Presentaciones culturales exclusivas
            </h3>
            <p className="opacity-80">
              Disfruta de espectáculos artísticos y culturales únicos.
            </p>
          </div>
        </Col>
        <Col md={4}>
          <div className="feature-card bg-white bg-opacity-10 p-6 rounded-lg text-center text-white">
            <FaComments className="text-5xl mb-4 text-yellow-300 mx-auto" />
            <h3 className="text-2xl font-semibold mb-2">
              Debates y foros interactivos
            </h3>
            <p className="opacity-80">
              Participa en discusiones enriquecedoras sobre temas actuales.
            </p>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="video-container rounded-lg overflow-hidden shadow-2xl mt-5">
            <iframe
              src="https://www.youtube.com/embed/LeMFKQJrVNQ"
              title="Video promocional de EventPlace"
              allowFullScreen
              className="w-full aspect-video"
            ></iframe>
          </div>
          <div className="text-center mt-8">
            <a
              href="https://www.youtube.com/watch?v=LeMFKQJrVNQ"
              target="_blank"
              rel="noopener noreferrer"
              className="youtube-button inline-flex items-center bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition duration-300 transform hover:scale-105 text-xl shadow-lg"
            >
              <FaYoutube className="mr-2 text-2xl" /> Canal Youtube
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  </section>
);

export default VideoPromoSection;
