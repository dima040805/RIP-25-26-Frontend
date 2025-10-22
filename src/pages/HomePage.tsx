// pages/HomePage/HomePage.tsx
import { type FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";
import Header from '../components/Header/Header';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { Button } from "react-bootstrap";
import './HomePage.css'; 
import backgroundImage from '../assets/background.png';

export const HomePage: FC = () => {
  return (
    <>
      <Header />
      <BreadCrumbs
        crumbs={[]}
      />
      <div className="home-banner">
        <div className="banner-content">
          <h1>Exoplanets</h1>
          <p>
            Добро пожаловать в Exoplanets! Здесь вы можете посчитать радиус экзопланеты по ее падению блеска.
          </p>
          <Link to={ROUTES.PLANETS}>
            <Button variant="primary">Просмотреть экзопланеты</Button>
          </Link>
        </div>
        <div className="banner-overlay"></div>
        <img 
          src={backgroundImage}
          alt="Exoplanets" 
          className="banner-bg"
        />
      </div>
    </>
  );
};