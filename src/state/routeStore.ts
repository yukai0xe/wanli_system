import { create } from "zustand";
import { initialRouteData } from "@/data/routeData";
import { timeToMinutes, minutesToTime } from "@/lib/utility";

type RouteStore = {
  routes: Route[];
  setRoutes: (routes: Route[]) => void;
  handleTimeChange: (cell: Cell, newValue: string | number) => void;
};

type Cell = {
    field: keyof RecordPoint;
    date: string;
    pointId: string;
    routeId: string;
};

const sortDataRule = (route: Route) => {
  const { id, days } = route;
  const newRoute: Route = { id, days: {}};
  for (const [date, rows] of Object.entries(days)) {
    newRoute.days[date] = rows.map((row) => {
      return {
        id: row.id,
        point: row.point,
        arrive: row.arrive,
        rest: row.rest,
        depart: row.depart,
        duration: row.duration,
        note: row.note,
      };
    });
  }
  return newRoute;
};

export const useRouteStore = create<RouteStore>((set, get) => ({
  routes: initialRouteData.map(sortDataRule),
  setRoutes: (routes) => set({ routes: routes.map(sortDataRule) }),
  clearRoutes: () => set({ routes: [] }),
  handleTimeChange: (cell, newValue) => {
    const { field, date, routeId, pointId } = cell;
    const { routes } = get();
      
    const newRoutes = routes.map((route) => {
        if (route.id !== routeId) return route;
        const newDays: typeof route.days = {};
        for (const d in route.days) {
            if (d !== date) {
                newDays[d] = route.days[d].map((r) => ({ ...r })); // 複製其他日期
            } else {
                const rows = route.days[d];
                const n = rows.length;
                const selectedRowIdx = rows.findIndex((r) => r.id === pointId);
                if (selectedRowIdx === -1) {
                    newDays[d] = rows.map((r) => ({ ...r }));
                    continue;
                }

                const newRows = rows.map((r,) => ({ ...r })); // 複製整個 row 陣列
                const selectedRow = newRows[selectedRowIdx];

                switch (field) {
                    case "depart":
                        if (typeof newValue === "string") {
                            const diff = timeToMinutes(newValue) - timeToMinutes(selectedRow.depart);
                            newRows.forEach((r) => {
                                r.depart = r.depart.length > 0 ? minutesToTime(timeToMinutes(r.depart) + diff) : newValue;
                                r.arrive = r.arrive.length > 0 ? minutesToTime(timeToMinutes(r.arrive) + diff) : newValue;
                            });
                        }
                        break;
                    case "arrive":
                        if (typeof newValue === "string") {
                            const diff = timeToMinutes(newValue) - timeToMinutes(selectedRow.arrive);
                            newRows.forEach((r) => {
                                r.depart = r.depart.length > 0 ? minutesToTime(timeToMinutes(r.depart) + diff) : newValue;
                                r.arrive = r.arrive.length > 0 ? minutesToTime(timeToMinutes(r.arrive) + diff) : newValue;
                            });
                        }
                        break;
                    case "duration":
                        if (!isNaN(Number(newValue))) {
                            const delta = Number(newValue) - selectedRow.duration;
                            for (let i = selectedRowIdx; i < n - 1; i++) {
                            if (i === selectedRowIdx) newRows[i].duration += delta;
                            newRows[i + 1].arrive =
                                newRows[i].depart.length > 0
                                ? minutesToTime(timeToMinutes(newRows[i].depart) + newRows[i].duration)
                                : "";
                            newRows[i + 1].depart =
                                newRows[i].arrive.length > 0
                                ? minutesToTime(timeToMinutes(newRows[i + 1].arrive) + newRows[i + 1].rest)
                                : "";
                            }
                        }
                        break;
                    case "rest":
                        if (!isNaN(Number(newValue))) {
                            const delta = Number(newValue) - selectedRow.rest;
                            for (let i = selectedRowIdx; i < n - 1; i++) {
                            if (i === selectedRowIdx) newRows[i].rest += delta;
                            newRows[i].depart =
                                newRows[i].arrive.length > 0
                                ? minutesToTime(timeToMinutes(newRows[i].arrive) + newRows[i].rest)
                                : "";
                            newRows[i + 1].arrive =
                                newRows[i].depart.length > 0
                                ? minutesToTime(timeToMinutes(newRows[i].depart) + newRows[i].duration)
                                : "";
                            }
                        }
                        break;
                    case "point":
                        selectedRow.point = newValue.toString();
                        break;
                    case "note":
                        selectedRow.note = newValue.toString();
                        break;
                }

                newDays[d] = newRows;
            }
        }

        return { ...route, days: newDays };
        });

        set({ routes: newRoutes });

    },
}));