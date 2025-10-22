// modules/mock.ts
import { type Planet } from "./PlanetsTypes";

export const PLANETS_MOCK: Planet[] = [ 
  {
    id: 1,
    image: "HD_209458_b.png",
    name: "TRAPPIST-1 e", 
    description: "TRAPPIST-1 e - это землеподобная экзопланета в обитаемой зоне",
    distance: 39,
    mass: 0.69,
    discovery: 2017,
    star_radius: 119000,
    is_delete: false
  },
  {
    id: 2,
    image: "",
    name: "Kepler-186 f", 
    description: "Kepler-186 f - первая землеподобная планета в обитаемой зоне другой звезды",
    distance: 582,
    mass: 1.4,
    discovery: 2014,
    star_radius: 476000,
    is_delete: false
  },
  {
    id: 3,
    image: "HD_209458_b.png",
    name: "Proxima Centauri b", 
    description: "Proxima Centauri b - ближайшая к Земле экзопланета в обитаемой зоне",
    distance: 4.24,
    mass: 1.27,
    discovery: 2016,
    star_radius: 107000,
    is_delete: false
  }
];