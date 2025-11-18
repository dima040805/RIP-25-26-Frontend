// pages/PlanetsPage/PlanetsPage.tsx
import { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import Search from '../components/Search/Search';
import PlanetsList from '../components/PlanetsList/PlanetsList';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS } from '../Routes';
import { listPlanets, getResearchCart } from '../modules/PlanetsApi';
import { PLANETS_MOCK } from '../modules/mock'; 
import { useAppDispatch, useAppSelector } from '../store/hiiks';
import { setPlanets, setLoading } from '../store/slices/planetSlice';
import { setSearchName, addToHistory } from '../store/slices/searchSlice';
import './PlanetsPage.css';
import TelescopeImage from '../assets/Telescope.png'
import { Link } from 'react-router-dom';

export default function PlanetsPage() {
  const dispatch = useAppDispatch();
  const { planets, loading } = useAppSelector(state => state.planets);
  const { searchName } = useAppSelector(state => state.search);
  const [researchCart, setResearchCart] = useState<{id: number, planets_count: number} | null>(null);

  // Загружаем корзину при монтировании
  useEffect(() => {
    const loadResearchCart = async () => {
      const cart = await getResearchCart();
      setResearchCart(cart);
    };
    loadResearchCart();
  }, []);

  // Основная функция загрузки данных
  const loadData = async (searchQuery?: string) => {
    dispatch(setLoading(true));
    
    try {
      // Пытаемся получить данные с API
      const apiData = await listPlanets({ name: searchQuery });
      
      if (apiData.length > 0) {
        // Если API вернул данные - используем их
        dispatch(setPlanets(apiData));
      } else {
        // Если API не вернул данных - используем моки
        let filteredMock = PLANETS_MOCK;
        if (searchQuery) {
          filteredMock = PLANETS_MOCK.filter(planet =>
            planet.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        dispatch(setPlanets(filteredMock));
      }
    } catch (error) {
      // Если ошибка API - используем моки
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

  // Проверяем активна ли корзина (id существует и planets_count > 0)
  const isCartActive = researchCart?.id && researchCart.planets_count > 0;

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
          
          {/* Телескоп - активный если есть исследование с планетами, неактивный если нет */}
          <div className="research-telescope-container">
            <Link 
              to={isCartActive ? `/research/${researchCart.id}` : '#'} 
              className={`research-telescope ${isCartActive ? 'active' : 'inactive'}`}
              onClick={(e) => {
                if (!isCartActive) {
                  e.preventDefault();
                  alert('У вас нет активного исследования с планетами');
                }
              }}
            >
              <img src={TelescopeImage} alt="Исследования" className="telescope-icon" />
              {researchCart?.planets_count && researchCart.planets_count > 0 && (
                <span className="telescope-badge">{researchCart.planets_count}</span>
              )}
            </Link>
          </div>

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