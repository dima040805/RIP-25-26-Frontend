// pages/PlanetPage/PlanetPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from '../Routes';
import { getPlanet } from '../modules/PlanetsApi';
import type { Planet } from '../modules/PlanetsTypes';
import { Spinner } from 'react-bootstrap';
import Header from '../components/Header/Header';
import { PLANETS_MOCK } from '../modules/mock'; // ← ИМПОРТИРУЙ МОКИ
import './PlanetPage.css';

export default function PlanetPage() {
  const [planet, setPlanet] = useState<Planet | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    
    const fetchPlanet = async () => {
      try {
        setLoading(true);
        const planetData = await getPlanet(Number(id));
        
        // Если API вернуло null (ошибка), используем моки
        if (!planetData) {
          const mockPlanet = PLANETS_MOCK.find(p => p.id === Number(id)) || null;
          setPlanet(mockPlanet);
        } else {
          setPlanet(planetData);
        }
      } catch (error) {
        console.error('Error fetching planet, using mocks:', error);
        // При ошибке используем моки
        const mockPlanet = PLANETS_MOCK.find(p => p.id === Number(id)) || null;
        setPlanet(mockPlanet);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanet();
  }, [id]);


  const getImageUrl = (filename: string) => {
    if (!filename || imageError) return '/src/assets/error_planet.png';
    return `http://localhost:9000/test/${filename}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="planet-page">
        <Header />
        <div className="planet-page-loader">
          <Spinner animation="border" />
        </div>
      </div>
    );
  }

  if (!planet) {
    return (
      <div className="planet-page">
        <Header />
        <div className="planet-not-found">
          <h1>Планета не найдена</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="planet-page">
      <Header />
      
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.PLANETS, path: ROUTES.PLANETS },
          { label: planet.name },
        ]}
      />

      <div className="page-heading-md">{planet.name}</div>
      
      <div className="visualization">
        <img 
          src={getImageUrl(planet.image)} 
          alt={planet.name}
          onError={handleImageError}
        />
      </div>

      <div className="description">
        <p>{planet.description}</p>
        
        <div className="planet-details">
          <h2>Характеристики планеты</h2>
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Расстояние от Земли:</span>
              <span className="value">{planet.distance} световых лет</span>
            </div>
            <div className="detail-item">
              <span className="label">Масса:</span>
              <span className="value">{planet.mass} масс Земли</span>
            </div>
            <div className="detail-item">
              <span className="label">Год открытия:</span>
              <span className="value">{planet.discovery}</span>
            </div>
            <div className="detail-item">
              <span className="label">Радиус звезды:</span>
              <span className="value">{planet.star_radius} км</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}