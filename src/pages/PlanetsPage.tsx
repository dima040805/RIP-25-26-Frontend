// pages/PlanetsPage/PlanetsPage.tsx
import { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import Search from '../components/Search/Search';
import PlanetsList from '../components/PlanetsList/PlanetsList';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS } from '../Routes';
import { listPlanets } from '../modules/PlanetsApi';
import { PLANETS_MOCK } from '../modules/mock'; 
import type { Planet } from '../modules/PlanetsTypes';
import './PlanetsPage.css';

export default function PlanetsPage() {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    if (useMock) {
      setPlanets(PLANETS_MOCK);
    } else {
      listPlanets()
        .then((data) => {
          if (data.length > 0) {
            setPlanets(data);
          } else {
            setPlanets(PLANETS_MOCK);
            setUseMock(true);
          }
        })
        .catch(() => {
          setPlanets(PLANETS_MOCK);
          setUseMock(true);
        });
    }
  }, [useMock]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filtered = await listPlanets({ name: searchName });
      
      if (filtered.length > 0) {
        setPlanets(filtered);
        setUseMock(false);
      } else {
        if (useMock) {
          const filteredMock = PLANETS_MOCK.filter(planet =>
            planet.name.toLowerCase().includes(searchName.toLowerCase())
          );
          setPlanets(filteredMock);
        } else {
          setPlanets([]);
        }
      }
    } catch (error) {
      const filteredMock = PLANETS_MOCK.filter(planet =>
        planet.name.toLowerCase().includes(searchName.toLowerCase())
      );
      setPlanets(filteredMock);
      setUseMock(true);
    } finally {
      setLoading(false);
    }
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

          <div className="services-search">
            <Search 
              query={searchName}
              onQueryChange={setSearchName}
              onSearch={handleSearch}
            />
          </div>

          {loading ? (
            <div>Загрузка...</div>
          ) : (
            <div className="services-grid">
              {planets.length > 0 ? (
                <PlanetsList planets={planets} />
              ) : (
                <div className="no-planets">
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