// pages/HomePage/HomePage.tsx
import { type FC, useState, useEffect } from "react";
import Header from '../components/Header/Header';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import './HomePage.css'; 
import backgroundImage from '../assets/background.png';
import backgroundImage2 from '../assets/background2.png';

export const HomePage: FC = () => {
  const [currentBackground, setCurrentBackground] = useState(0);
  const backgrounds = [backgroundImage, backgroundImage2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % backgrounds.length);
    }, 5000); // Смена каждые 5 секунд

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />
      <BreadCrumbs
        crumbs={[]}
      />
      <div className="home-banner">
        <div className="banner-content">
          <h1>Exoplanets</h1>
          <p className="banner-description">
            Добро пожаловать в Exoplanets! Здесь вы можете посчитать радиус экзопланеты по ее падению блеска.
          </p>
        </div>
        <div className="banner-overlay"></div>
        <img 
          src={backgrounds[currentBackground]}
          alt="Exoplanets" 
          className="banner-bg"
        />
        <div className="carousel-indicators">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentBackground ? 'active' : ''}`}
              onClick={() => setCurrentBackground(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
};