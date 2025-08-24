import { DateType, TeamActivityType, TeamCategory, EventState } from "@/types/enum";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { parseEnumKey } from "@/lib/utility";
import { apiFetch } from "@/lib/middleware/clientAuth";

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
      name: "draftTeam",
    }
  )
)

// use for current selected planning team
export const usePlanTeamStore = create<PlanTeamState>()(
    devtools((set, get) => ({
        id: null,
        team: initialTeam,
        setId: (id: number) =>
            set((state) => ({
                id: id ?? state.id
            })),
        setTeam: (team: Partial<PlanTeam>) =>
            set((state) => ({
                team: { ...state.team, ...team, members: team.members ?? state.team.members } as PlanTeam,
            })),
        resetTeam: () => set({ id: null, team: initialTeam }),
        getTeamWithFetch: async (idParam: number) => {
            const state = get();
            if (state.id  === idParam) {
              return state.team;
            } else {
              try {
                  const fetchedTeamData = await apiFetch<{
                    team: PlanTeam,
                    planTeamMeta: PlanTeamMeta
                  }>(`/planTeam?id=${idParam}`);
                  if (!fetchedTeamData) throw new Error('Team not found');
                  const { team, planTeamMeta } = fetchedTeamData;
                  set({ team, id: idParam });
                
                  const metaStore = usePlanTeamMetaStore.getState();
                  if(!metaStore.getPlanTeamMetaById(idParam)) metaStore.addPlanTeamMeta(planTeamMeta);
                  return team;

                } catch (err) {
                    console.error('Fetch error:', err);
                    throw err;
                }
            }
        },
    }),
      {name: "planTeam"}
));

// display all planning team meta for current user or group
export const usePlanTeamMetaStore = create<PlanTeamMetaStore>()(
  devtools(
    (set, get) => ({
      teamMetas: [],

      setPlanTeamMeta: (metas: PlanTeamMeta[]) => set({ teamMetas: metas }),

      addPlanTeamMeta: (meta) =>
        set((state) => ({
          teamMetas: [...state.teamMetas, meta]
        })),

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

      getPlanTeamMetaById: (id) => get().teamMetas.find((team) => team.id === id) || null,
    }),
    { name: "PlanTeamMetaStore" }
  )
);