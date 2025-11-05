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
  
  const { researchDetail, loading, saveLoading, error } = useAppSelector(state => state.research);
  const { isAuthenticated } = useAppSelector(state => state.user);
  
  const [observationDate, setObservationDate] = useState('');
  const [planetShines, setPlanetShines] = useState<{ [key: number]: number }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const researchId = id ? parseInt(id, 10) : null;

  const getStatusText = (status: string | undefined) => {
    if (!status) return 'Неизвестно';
    
    const statusMap: { [key: string]: string } = {
      'draft': 'Черновик',
      'formed': 'Сформирована', 
      'completed': 'Завершена',
      'rejected': 'Отклонена',
    };
    
    return statusMap[status] || status;
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
      
      const shines: { [key: number]: number } = {};
      const planets = getPlanets();
      
      planets.forEach(planet => {
        if (planet.planet_shine !== undefined && planet.planet_shine !== null) {
          shines[planet.id] = planet.planet_shine;
        }
      });
      
      setPlanetShines(shines);
    }
  }, [researchDetail]);

  const handleShineChange = (planetId: number, value: string) => {
    if (!isDraft()) return;
    
    const numValue = parseFloat(value) || 0;
    setPlanetShines(prev => ({
      ...prev,
      [planetId]: numValue
    }));
  };

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
      
      setSuccessMessage('Дата успешно сохранена!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setSuccessMessage('Ошибка сохранения даты');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleSavePlanetShine = async (planetId: number) => {
    if (!researchId || !isDraft()) return;
    
    const shineValue = planetShines[planetId];
    if (shineValue === undefined) return;
    
    try {
      await dispatch(updatePlanetShine({
        planetId,
        researchId,
        shine: shineValue
      })).unwrap();
      
      setSuccessMessage('Данные планеты успешно сохранены!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setSuccessMessage('Ошибка сохранения данных планеты');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleRemovePlanet = async (planetId: number) => {
    if (!researchId || !isDraft()) return;
    
    try {
      await dispatch(removeFromResearch({
        planetId,
        researchId
      })).unwrap();
      
      dispatch(getResearchDetail(researchId));
      
      setSuccessMessage('Планета удалена из исследования!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setSuccessMessage('Ошибка удаления планеты');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDeleteResearch = async () => {
    if (!researchId || !isDraft()) return;
    
    if (!window.confirm('Вы уверены, что хотите удалить это исследование?')) {
      return;
    }
    
    try {
      await dispatch(deleteResearch(researchId)).unwrap();
      navigate('/planets');
    } catch (error) {
      setSuccessMessage('Ошибка удаления исследования');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleSubmitResearch = async () => {
    if (!researchId || !isDraft()) return;
    
    setSubmitLoading(true);
    setSuccessMessage('');
    
    try {
      await dispatch(formResearch(researchId)).unwrap();
      
      setSuccessMessage('Исследование успешно подтверждено!');
      
      setTimeout(() => {
        dispatch(getResearchDetail(researchId));
      }, 1000);
      
    } catch (error: any) {
      setSuccessMessage('Ошибка при подтверждении исследования');
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

  if (error) {
    return (
      <div className="research-page">
        <Header />
        <div className="error-message">
          Ошибка загрузки исследования: {error}
        </div>
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
          <p>Статус: <strong>{getStatusText(currentStatus)}</strong></p>
          <p>Создатель: {researchData?.creator_login || 'Неизвестно'}</p>
          {researchData?.moderator_login && (
            <p>Модератор: {researchData.moderator_login}</p>
          )}
        </div>

        {successMessage && (
          <div className={`success-message ${successMessage.includes('Ошибка') ? 'error' : 'success'}`}>
            {successMessage}
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
                disabled={saveLoading.date || !observationDate}
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
            {planets.map((planet) => {
              const shineValue = planetShines[planet.id] ?? planet.planet_shine ?? '';
              
              return (
                <li key={planet.id}>
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
                    
                    {isDraft() ? (
                      <div className="shine-input-container">
                        <input 
                          type="number" 
                          step="0.01"
                          min="0"
                          max="100"
                          className="content-list-section shine-input"
                          placeholder="Введите падение ~1%" 
                          value={shineValue}
                          onChange={(e) => handleShineChange(planet.id, e.target.value)}
                        />
                        <button 
                          className="btn-save-shine"
                          onClick={() => handleSavePlanetShine(planet.id)}
                          disabled={saveLoading.planets[planet.id] || shineValue === 0}
                        >
                          {saveLoading.planets[planet.id] ? '...' : 'Сохранить'}
                        </button>
                      </div>
                    ) : (
                      <div className="shine-value">
                        {shineValue ? `${shineValue}%` : '—'}
                      </div>
                    )}

                    <div className="calculated-radius">
                      {planet.planet_radius ? `${planet.planet_radius} км` : '—'}
                    </div>

                    {isDraft() && (
                      <div className="planet-actions">
                        <button 
                          className="btn-remove-planet"
                          onClick={() => handleRemovePlanet(planet.id)}
                          title="Удалить планету из исследования"
                        >
                          <img src={deleteIcon} alt="Удалить" className="delete-icon" />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
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