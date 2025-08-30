import { create } from "zustand";

const useTeamStore = create((set) => ({
  currentTeam: {} as TeamSchema,
  allTeams: [] as TeamSchema[],
  setAllTeams: (teams: TeamSchema[]) => set({ allTeams: teams }),
  setCurrentTeam: (team: TeamSchema) => set({ currentTeam: team }),
}));

const useUserStore = create<UserState>((set) => ({
  username: "",
  userId: "",
  setUser: (id, name) => set({ userId: id, username: name }),
}));

const useViewState = create<ViewState>((set) => ({
  loading: true,
  setLoading: (loading) => set({ loading }),
}));

export { useTeamStore, useUserStore, useViewState };