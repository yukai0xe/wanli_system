import { DateType, TeamActivityType, TeamCategory, EventState } from "@/types/enum";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { parseEnumKey } from "@/lib/utility";

const initialTeam: PlanTeam = {
  mainName: "",
  mainDescription: "",
  type: [parseEnumKey(TeamCategory, TeamCategory.General), parseEnumKey(TeamActivityType, TeamActivityType.Official)],
  dateType: parseEnumKey(DateType, DateType.OneDay),
  startDate: "",
  endDate: "",
  prepareDate: 1,
  members: [],
  expectedTeamSize: null,
  transportType: [],
};

export const initialEventStats: EventStateDict = {
  firstMeetingState: EventState.NotStart,
  firstCheckItemState: EventState.NotStart,
  secondCheckItemState: EventState.NotStart,
  finalCheckState: EventState.NotStart
}

// use for new team form with localStorage 
export const useDraftTeamStore = create<PlanTeamState>()(
    persist(
    (set) => ({
        id: null,
        team: initialTeam,
        setTeam: (team: Partial<PlanTeam>) =>
            set((state) => ({
                team: { ...state.team, ...team } as PlanTeam,
            })),
        resetTeam: () => set({ id: null, team: initialTeam }),
    }),
    {
      name: "planTeam",
    }
  )
)

// use for current selected planning team
export const usePlanTeamStore = create<PlanTeamState>()(
    (set, get) => ({
        id: null,
        team: initialTeam,
        setId: (id: number) =>
            set((state) => ({
                id: id ?? state.id
            })),
        setTeam: (team: Partial<PlanTeam>) =>
            set((state) => ({
                team: { ...state.team, ...team } as PlanTeam,
            })),
        resetTeam: () => set({ id: null, team: initialTeam }),
        getTeamWithFetch: async (idParam: number) => {
            const state = get();
            if (state.id) {
                return state.team;
            } else {
                try {
                    const accessToken = localStorage.getItem("access_token");
                    const res = await fetch(`/api/planTeam?id=${idParam}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        }
                    });
                    if (!res.ok) throw new Error('Network response was not ok');

                    const fetchedTeam = await res.json();

                    if (!fetchedTeam) throw new Error('Team not found');
                    
                    set({ team: fetchedTeam, id: idParam });
                    return fetchedTeam;

                } catch (err) {
                    console.error('Fetch error:', err);
                    throw err;
                }
            }
        },
    })
);

// display all planning team meta for current user or group
export const usePlanTeamMetaStore = create<PlanTeamMetaStore>((set, get) => ({
  teamMetas: [],

  setPlanTeamMeta: (metas: PlanTeamMeta[]) => set({ teamMetas: metas }),

  addPlanTeamMeta: (meta) =>
    set((state) => ({ teamMetas: [...state.teamMetas, meta] })),

  updatePlanTeamMeta: (id, updated) =>
    set((state) => ({
      teamMetas: state.teamMetas.map((team) =>
        team.id === id ? { ...team, ...updated } : team
      ),
    })),

  removePlanTeamMeta: (id) =>
    set((state) => ({
      teamMetas: state.teamMetas.filter((team) => team.id !== id),
    })),

  getPlanTeamMetaById: (id) => get().teamMetas.find((team) => team.id === id),
}));