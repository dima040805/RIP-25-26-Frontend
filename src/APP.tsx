import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { AlbumPage } from "./pages/AlbumPage";
import PlanetsPage from "./pages/PlanetsPage";
import { ROUTES } from "./Routes";
import { HomePage } from "./pages/HomePage";
import PlanetPage from './pages/PlanetPage';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <BrowserRouter basename="/RIP-25-26-Frontend">      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.PLANETS} element={<PlanetsPage />} />
        <Route path={ROUTES.PLANET} element={<PlanetPage />} />      </Routes>
    </BrowserRouter>
  );
}

export default App;