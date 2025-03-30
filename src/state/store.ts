import { create } from "zustand";

const useTeamStore = create((set) => ({
  currentTeam: {} as TeamSchema,
  allTeams: [] as TeamSchema[],
  setAllTeams: (teams: TeamSchema[]) => set({ allTeams: teams }),
  setCurrentTeam: (team: TeamSchema) => set({ currentTeam: team }),
}));

export { useTeamStore };