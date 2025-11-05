export const ROUTES = {
  HOME: "/",
  PLANETS: "/planets",
  PLANET: "/planets/:id",
  RESEARCHES: "/researches",
  PROFILE: "/profile",
  LOGIN: "/login", 
  REGISTER: "/register",
  RESEARCH: "/research/:id"
}

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
  HOME: "Главная",
  PLANETS: "Экзопланеты",
  PLANET: "Экзопланета",
  RESEARCHES: "Мои исследования",
  PROFILE: "Личный кабинет",
  LOGIN: "Вход",
  REGISTER: "Регистрация",
  RESEARCH: "Исследование"
};