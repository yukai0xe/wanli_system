import { create } from "zustand";

const useTeamStore = create((set) => ({
  currentTeam: {},
  allTeams: [],
  setAllTeams: (teams) => set({ allTeams: teams }),
  setCurrentTeam: (team) => set({ currentTeam: team }),
}));

export { useTeamStore };