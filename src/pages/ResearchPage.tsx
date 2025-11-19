import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS } from '../Routes';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  getResearchDetail, 
  deleteResearch,
  updateResearchDate,
  updatePlanetShine,
  removeFromResearch,
  formResearch
} from '../store/slices/researchSlice';
import './ResearchPage.css';
import defaultPlanetImage from '../assets/error_planet.png';
import deleteIcon from '../assets/delete-icon.png';

export default function ResearchPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { researchDetail, loading, saveLoading } = useAppSelector(state => state.research);
  const { isAuthenticated } = useAppSelector(state => state.user);
  
  const [observationDate, setObservationDate] = useState('');
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const researchId = id ? parseInt(id, 10) : null;

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const isDraft = () => {
    const status = researchDetail?.research?.status || researchDetail?.status;
    return status === 'draft';
  };

  const getPlanets = () => {
    if (!researchDetail) return [];
    
    const researchPlanets = researchDetail.researchPlanets || researchDetail.planets || [];
    const planetsResearch = researchDetail.planetsResearch || [];
    
    const mergedPlanets = researchPlanets.map(planet => {
      const planetResearch = planetsResearch.find((pr:any) => pr.planet_id === planet.id);
      return {
        ...planet,
        planet_shine: planetResearch?.planet_shine,
        planet_radius: planetResearch?.planet_radius
      };
    });

    return mergedPlanets;
  };

  const getResearchData = () => {
    return researchDetail?.research || researchDetail;
  };

  useEffect(() => {
    if (researchId && isAuthenticated) {
      dispatch(getResearchDetail(researchId));
    }
  }, [researchId, isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (researchDetail) {
      const researchData = getResearchData();
      if (researchData?.date_research) {
        setObservationDate(researchData.date_research);
      } else if (researchDetail.date_research) {
        setObservationDate(researchDetail.date_research);
      }
    }
  }, [researchDetail]);

  const handleImageError = (planetId: number) => {
    setImageErrors(prev => ({
      ...prev,
      [planetId]: true
    }));
  };

  const getImageUrl = (planet: any) => {
    if (imageErrors[planet.id] || !planet.image) {
      return defaultPlanetImage;
    }
    return `http://localhost:9000/test/${planet.image}`;
  };

  const handleSaveDate = async () => {
    if (!researchId || !observationDate || !isDraft()) return;
    
    try {
      await dispatch(updateResearchDate({
        researchId,
        date: observationDate
      })).unwrap();
      
      showNotification('success', 'Дата успешно сохранена!');
    } catch (error: any) {
      showNotification('error', 'Ошибка сохранения даты: ' + (error.message || 'Неизвестная ошибка'));
    }
  };

  const handleSavePlanetShine = async (planetId: number, shineValue: number) => {
    if (!researchId || !isDraft()) return;
    
    if (shineValue <= 0 || shineValue > 4) {
      showNotification('error', 'Падение блеска должно быть от 0.1% до 4%');
      return;
    }
    
    try {
      await dispatch(updatePlanetShine({
        planetId,
        researchId,
        shine: shineValue
      })).unwrap();
      
      showNotification('success', 'Падение блеска сохранено!');
    } catch (error: any) {
      showNotification('error', 'Ошибка сохранения блеска: ' + (error.message || 'Неизвестная ошибка'));
    }
  };

  const handleRemovePlanet = async (planetId: number) => {
    if (!researchId || !isDraft()) return;
    
    if (!window.confirm('Вы уверены, что хотите удалить планету из исследования?')) {
      return;
    }
    
    try {
      await dispatch(removeFromResearch({
        planetId,
        researchId
      })).unwrap();
      
      dispatch(getResearchDetail(researchId));
      showNotification('success', 'Планета удалена из исследования!');
    } catch (error: any) {
      showNotification('error', 'Ошибка удаления планеты: ' + (error.message || 'Неизвестная ошибка'));
    }
  };

  const handleDeleteResearch = async () => {
    if (!researchId || !isDraft()) return;
    
    if (!window.confirm('Вы уверены, что хотите удалить это исследование?')) {
      return;
    }
    
    try {
      await dispatch(deleteResearch(researchId)).unwrap();
      showNotification('success', 'Исследование удалено!');
      setTimeout(() => navigate('/planets'), 1000);
    } catch (error: any) {
      showNotification('error', 'Ошибка удаления исследования: ' + (error.message || 'Неизвестная ошибка'));
    }
  };

  const handleSubmitResearch = async () => {
    if (!researchId || !isDraft()) return;
    
    const planets = getPlanets();
    const hasEmptyShine = planets.some(planet => {
      return !planet.planet_shine || planet.planet_shine === 0;
    });
    
    if (hasEmptyShine) {
      showNotification('error', 'Заполните падение блеска для всех планет');
      return;
    }
    
    if (!observationDate) {
      showNotification('error', 'Укажите дату исследования');
      return;
    }
    
    setSubmitLoading(true);
    
    try {
      await dispatch(formResearch(researchId)).unwrap();
      
      showNotification('success', 'Исследование успешно подтверждено!');
      
      setTimeout(() => {
        navigate('/planets');
      }, 2000);
      
    } catch (error: any) {
      showNotification('error', 'Ошибка подтверждения: ' + (error.message || 'Неизвестная ошибка'));
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="research-page">
        <Header />
        <div className="loading">Загрузка исследования...</div>
      </div>
    );
  }

  if (!researchDetail) {
    return (
      <div className="research-page">
        <Header />
        <div className="empty-research">
          <p>Исследование не найдено</p>
          <button 
            className="btn-primary-back"
            onClick={() => navigate('/planets')}
          >
            Вернуться к планетам
          </button>
        </div>
      </div>
    );
  }

  const researchData = getResearchData();
  const planets = getPlanets();
  const currentStatus = researchData?.status || 'unknown';
  const researchDisplayId = researchData?.id || researchId;

  return (
    <div className="research-page">
      <Header />
      
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.PLANETS, path: '/planets' },
          { label: `Исследование #${researchDisplayId}` },
        ]}
      />
      
      <main>
        <div className="research-header">
          <h1>Планеты для исследования #{researchDisplayId}</h1>
          <p>Всего планет: {planets.length}</p>
          <p>Статус: <strong>{currentStatus}</strong></p>
        </div>

        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        <div className="date-section">
          <div className="date-input-container">
            <input  
              type="text" 
              className="content-list-section date-input"
              placeholder="Введите дату наблюдений (ГГГГ-ММ-ДД)" 
              value={observationDate}
              onChange={(e) => setObservationDate(e.target.value)}
              disabled={!isDraft()}
            />
            {isDraft() && (
              <button 
                className="btn-save-date"
                onClick={handleSaveDate}
                disabled={!observationDate || saveLoading.date}
              >
                {saveLoading.date ? 'Сохранение...' : 'Сохранить дату'}
              </button>
            )}
          </div>
        </div>

        <div className="research-table-header">
          <span className="planet-name-header">Название планеты</span>
          <span className="star-radius-header">Радиус звезды</span>
          <span className="shine-header">Падение блеска, %</span>
          <span className="calculated-radius-header">Расчитанный радиус</span>
          {isDraft() && <span className="actions-header">Действия</span>}
        </div>

        {planets.length > 0 ? (
          <ul className="research-grid-list">
            {planets.map((planet) => (
              <PlanetRow 
                key={planet.id}
                planet={planet}
                isDraft={isDraft()}
                onSaveShine={handleSavePlanetShine}
                onRemovePlanet={handleRemovePlanet}
                saveLoading={saveLoading}
                getImageUrl={getImageUrl}
                handleImageError={handleImageError}
              />
            ))}
          </ul>
        ) : (
          <div className="empty-research">
            <p>Нет планет для исследования</p>
          </div>
        )}

        <div className="research-actions">
          {isDraft() ? (
            <>
              <button 
                className="btn-primary-danger" 
                onClick={handleDeleteResearch}
                disabled={submitLoading}
              >
                Удалить заявку
              </button>
              
              <button 
                className="btn-primary-confirm" 
                onClick={handleSubmitResearch}
                disabled={submitLoading || planets.length === 0}
              >
                {submitLoading ? 'Подтверждение...' : 'Подтвердить заявку'}
              </button>
            </>
          ) : (
            <button 
              className="btn-primary-back"
              onClick={() => navigate('/researches')}
            >
              Назад к исследованиям
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

// Выносим строку планеты в отдельный компонент
function PlanetRow({ 
  planet, 
  isDraft, 
  onSaveShine, 
  onRemovePlanet, 
  saveLoading, 
  getImageUrl, 
  handleImageError 
}: any) {
  const [localShine, setLocalShine] = useState(planet.planet_shine || '');

  const handleShineChange = (value: string) => {
    if (!isDraft) return;
    setLocalShine(value);
  };

  const handleSave = () => {
    const shineValue = parseFloat(localShine);
    if (!isNaN(shineValue)) {
      onSaveShine(planet.id, shineValue);
    }
  };

  return (
    <li>
      <div className="research-item">
        <a href={`/planets/${planet.id}`} className="research-item-thumbnail">
          <img 
            src={getImageUrl(planet)}
            alt={planet.name}
            onError={() => handleImageError(planet.id)}
            style={{ 
              width: '409.33px', 
              height: '241.68px', 
              objectFit: 'contain', 
              background: 'black' 
            }}
          />
        </a>

        <a href={`/planets/${planet.id}`} className="research-item-heading">
          <div className="research-planet-name">{planet.name}</div>
        </a>

        <div className="star-radius-value">
          <span>{planet.star_radius} км</span>
        </div>
        
        {isDraft ? (
          <div className="shine-input-container">
            <input 
              type="number" 
              step="0.1"
              min="0.1"
              max="4"
              className="content-list-section shine-input"
              placeholder="Введите падение ~1%" 
              value={localShine}
              onChange={(e) => handleShineChange(e.target.value)}
            />
            <button 
              className="btn-save-shine"
              onClick={handleSave}
              disabled={saveLoading.planets?.[planet.id] || !localShine || parseFloat(localShine) < 0.1 || parseFloat(localShine) > 4}
            >
              {saveLoading.planets?.[planet.id] ? '...' : 'Сохранить'}
            </button>
          </div>
        ) : (
          <div className="shine-value">
            {planet.planet_shine ? `${planet.planet_shine}%` : '—'}
          </div>
        )}

        <div className="calculated-radius">
          {planet.planet_radius ? `${planet.planet_radius} км` : '—'}
        </div>

        {isDraft && (
          <div className="planet-actions">
            <button 
              className="btn-remove-planet"
              onClick={() => onRemovePlanet(planet.id)}
              title="Удалить планету из исследования"
            >
              <img src={deleteIcon} alt="Удалить" className="delete-icon" />
            </button>
          </div>
        )}
      </div>
    </li>
  );
}