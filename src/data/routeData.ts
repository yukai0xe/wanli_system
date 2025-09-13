import dayjs from "dayjs";
import { v7 as uuidv7 } from "uuid";

export const emptyDateRoute: RecordPoint[] = [
  {
    id: uuidv7(),
    point: "",
    arrive: "12:00",
    depart: "12:00",
    rest: 0,
    duration: 0,
    note: "",
  },
  {
    id: uuidv7(),
    point: "",
    arrive: "12:00",
    depart: "12:00",
    rest: 0,
    duration: 0,
    note: "",
  },
];

export const initialRouteData: Route[] = [
  {
    id: uuidv7(),
    source: "",
    teamSize: 1,
    weather: "晴",
    days: {
      [dayjs().format("YYYY-MM-DD")]: [
        {
          id: uuidv7(),
          point: "逢甲大學正門",
          arrive: "",
          depart: "07:00",
          rest: 0,
          duration: 180,
          note: "出發集合",
        },
        {
          id: uuidv7(),
          point: "目的地",
          arrive: "10:00",
          depart: "",
          rest: 0,
          duration: 0,
          note: "",
        },
      ],
      [dayjs().add(1, "day").format("YYYY-MM-DD")]: [
        {
          id: uuidv7(),
          point: "目的地",
          arrive: "",
          depart: "07:00",
          rest: 0,
          duration: 180,
          note: "出發集合",
        },
        {
          id: uuidv7(),
          point: "逢甲大門東門",
          arrive: "10:00",
          depart: "",
          rest: 0,
          duration: 0,
          note: "",
        },
      ],
    },
  },
  {
    id: uuidv7(),
    source: "",
    teamSize: 1,
    weather: "晴",
    days: {
      [dayjs().format("YYYY-MM-DD")]: emptyDateRoute,
      [dayjs().add(1, "day").format("YYYY-MM-DD")]: emptyDateRoute,
    },
  },
];
