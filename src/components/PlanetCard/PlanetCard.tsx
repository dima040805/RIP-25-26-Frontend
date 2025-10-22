import { Link } from "react-router-dom";
import type { Planet } from "../../modules/PlanetsTypes";

import './PlanetCard.css';
import { useState, useEffect } from 'react';
import defaultPlanetImage from '../../assets/error_planet.png';

export default function PlanetCard({ planet }: { planet: Planet }) {
    const [imageError, setImageError] = useState(false);
    
    const getImageUrl = (filename: string) => {
        if (!filename) return defaultPlanetImage;
        return `http://localhost:9000/test/${filename}`;
    };

    const [imageUrl, setImageUrl] = useState(getImageUrl(planet.image));

    useEffect(() => {
        if (!planet.image) {
            setImageUrl(defaultPlanetImage);
        } else {
            setImageUrl(getImageUrl(planet.image));
        }
    }, [planet.image]);

    const handleImageError = () => {
        setImageError(true);
        setImageUrl(defaultPlanetImage);
    };

    return (
        <div className="hds-content-item content-list-item-exoplanet">
            <a href={`/planet/${planet.id}`} className="hds-content-item-thumbnail">
                <img 
                    src={imageError ? defaultPlanetImage : imageUrl}
                    alt={planet.name}
                    onError={handleImageError}
                    style={{ 
                        width: '429.33px', 
                        height: '241.68px', 
                        objectFit: 'contain', 
                        background: 'black' 
                    }} 
                />
            </a>
        <div>
          <Link to={`/planet/${planet.id}`}className="hds-content-item-heading">
            <div className="hds-a11y-heading-22">{planet.name}</div>
          </Link>
          <div className="CustomField">
            <div>
              <span className="font-weight-bold">Радиус звезды:</span>
              <span>{planet.star_radius} км</span>
            </div>
          </div>
        </div>
      </div>
  );
}

