import { useEffect } from 'react';
import Header from '../components/Header/Header';
import Search from '../components/Search/Search';
import PlanetsList from '../components/PlanetsList/PlanetsList';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS } from '../Routes';
import { listPlanets } from '../modules/PlanetsApi';
import { PLANETS_MOCK } from '../modules/mock'; 
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPlanets, setLoading } from '../store/slices/planetSlice';
import { setSearchName, addToHistory } from '../store/slices/searchSlice';
import { getResearchCart } from '../store/slices/researchSlice';
import './PlanetsPage.css';
import TelescopeImage from '../assets/Telescope.png'
import { Link } from 'react-router-dom';

export default function PlanetsPage() {
  const dispatch = useAppDispatch();
  const { planets, loading } = useAppSelector(state => state.planets);
  const { searchName } = useAppSelector(state => state.search);
  const { isAuthenticated } = useAppSelector(state => state.user);
  const { researchCart, planets_count } = useAppSelector(state => state.research);

  // Загружаем корзину при монтировании
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getResearchCart());
    }
  }, [isAuthenticated, dispatch]);

  // Основная функция загрузки данных
  const loadData = async (searchQuery?: string) => {
    dispatch(setLoading(true));
    
    try {
      const apiData = await listPlanets({ name: searchQuery });
      
      if (apiData.length > 0) {
        dispatch(setPlanets(apiData));
      } else {
        let filteredMock = PLANETS_MOCK;
        if (searchQuery) {
          filteredMock = PLANETS_MOCK.filter(planet =>
            planet.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        dispatch(setPlanets(filteredMock));
      }
    } catch (error) {
      let filteredMock = PLANETS_MOCK;
      if (searchQuery) {
        filteredMock = PLANETS_MOCK.filter(planet =>
          planet.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      dispatch(setPlanets(filteredMock));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadData(searchName);
  }, []);

  const handleSearch = async () => {
    if (searchName) {
      dispatch(addToHistory(searchName));
    }
    await loadData(searchName);
  };

  return (
    <div className="planets-page">
      <Header />
      
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.PLANETS },
        ]}
      />
      
      <main>
        <div className="services-wrapper">
          <h1>Планеты</h1>
          
          {/* Телескоп - активный если есть исследование, неактивный если нет */}
          {isAuthenticated ? (
            <Link 
              to={researchCart?.id ? `/research/${researchCart.id}` : '#'} 
              className={`research-telescope ${researchCart?.id ? 'active' : 'inactive'}`}
              onClick={(e) => {
                if (!researchCart?.id) {
                  e.preventDefault();
                  alert('У вас нет активного исследования');
                }
              }}
            >
              <img src={TelescopeImage} alt="Исследования" className="telescope-icon" />
              {planets_count > 0 && (
                <span className="telescope-badge">{planets_count}</span>
              )}
            </Link>
          ) : (
            <div 
              className="research-telescope inactive"
              onClick={() => alert('Для доступа к исследованиям необходимо войти в систему')}
            >
              <img src={TelescopeImage} alt="Исследования" className="telescope-icon" />
            </div>
          )}

          <div className="services-search">
            <Search 
              query={searchName}
              onQueryChange={(value) => dispatch(setSearchName(value))}
              onSearch={handleSearch}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>
          ) : (
            <div className="services-grid">
              {planets.length > 0 ? (
                <PlanetsList planets={planets} />
              ) : (
                <div className="no-planets" style={{ textAlign: 'center', padding: '40px' }}>
                  {searchName 
                    ? `По запросу "${searchName}" планеты не найдены` 
                    : 'Планеты не найдены'
                  }
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}