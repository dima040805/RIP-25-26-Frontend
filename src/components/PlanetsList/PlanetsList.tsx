// components/PlanetsList/PlanetsList.tsx
import './PlanetsList.css';
import PlanetCard from '../PlanetCard/PlanetCard';
import { type Planet } from '../../modules/PlanetsTypes';




export default function PlanetsList({ planets }: {planets: Planet[]}) {
  return (
    <div className="grid-list">
      {planets.map((s) => (
        <PlanetCard key={s.id} planet={s} />  
      ))}
    </div>
  );
}