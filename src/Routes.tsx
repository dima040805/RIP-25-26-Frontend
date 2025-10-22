export const ROUTES = {
  HOME: "/",
  PLANETS: "/planets",
  PLANET: "/planet/:id" // ← добавить эту строку
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
  HOME: "Главная",
  PLANETS: "Экзопланеты",
  PLANET: "Экзопланета"
};