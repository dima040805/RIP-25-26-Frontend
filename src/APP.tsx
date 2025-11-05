// src/Routes.tsx - добавить новые маршруты
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PlanetsPage from "./pages/PlanetsPage";
import { ROUTES } from "./Routes";
import { HomePage } from "./pages/HomePage";
import PlanetPage from './pages/PlanetPage';
import LoginPage from './pages/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css'
import RegistrationPage from './pages/RegistrationPage';
import ResearchPage from './pages/ResearchPage';
import ResearchesPage from './pages/ResearchesPage';
import ProfilePage from './pages/ProfilePage'; 

function App() {
  return (
    <BrowserRouter basename="/RIP-25-26-Frontend">      
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.PLANETS} element={<PlanetsPage />} />
        <Route path={ROUTES.PLANET} element={<PlanetPage />} />     
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/research/:id" element={<ResearchPage />} />
        <Route path="/researches" element={<ResearchesPage />} />
        <Route path="/profile" element={<ProfilePage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;