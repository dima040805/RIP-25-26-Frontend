import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import type { Planet } from "../../modules/PlanetsTypes";
import type { AppDispatch, RootState } from '../../store';
import { addToResearch } from '../../store/slices/researchSlice';

import './PlanetCard.css';
import { useState, useEffect } from 'react';
import defaultPlanetImage from '../../assets/error_planet.png';

export default function PlanetCard({ planet }: { planet: Planet }) {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useSelector((state: RootState) => state.user);
    const { loading } = useSelector((state: RootState) => state.research);
    
    const [imageError, setImageError] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState('');
    
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

    const handleAddToResearch = async () => {
        if (!isAuthenticated) {
            return;
        }

        setAddLoading(true);
        setAddError('');
        try {
            await dispatch(addToResearch(planet.id)).unwrap();
            // Успешно добавлено
            console.log('Планета добавлена в исследование');
        } catch (error: any) {
            if (error.response?.status === 409) {
                setAddError('Планета уже добавлена в исследование');
            } else {
                setAddError('Ошибка добавления в исследование');
            }
            console.error('Ошибка добавления в исследование:', error);
        } finally {
            setAddLoading(false);
        }
    };

    return (
        <div className="hds-content-item content-list-item-exoplanet">
            <Link to={`/planets/${planet.id}`} className="hds-content-item-thumbnail">
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
            </Link>
            <div>
                <Link to={`/planets/${planet.id}`} className="hds-content-item-heading">
                    <div className="hds-a11y-heading-22">{planet.name}</div>
                </Link>
                <div className="CustomField">
                    <div>
                        <span className="font-weight-bold">Радиус звезды:</span>
                        <span>{planet.star_radius} км</span>
                    </div>
                </div>
                
                {/* Кнопка добавления в исследование - ВСЕГДА видна */}
                <button 
                    onClick={handleAddToResearch}
                    disabled={addLoading || loading}
                    className={`add-to-research-btn ${!isAuthenticated ? 'not-authenticated' : ''}`}
                >
                    {addLoading ? 'Добавление...' : 'Добавить к исследованию'}
                </button>
                
                {/* Сообщение об ошибке */}
                {addError && (
                    <div className="add-error-message">
                        {addError}
                    </div>
                )}
            </div>
        </div>
    );
}