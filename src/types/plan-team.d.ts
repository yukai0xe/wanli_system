import { EventStateDict } from "./event";

declare global {
  interface PlanTeam {
    mainName: string;
    mainDescription: string;
    type: TeamType;
    dateType: DateType;
    startDate: Date | string;
    endDate: Date | string;
    prepareDate: number;
    members: (Member & { maxWeight?: number })[];
    expectedTeamSize: number | null;
    transportType: string[];
  }

  interface PlanTeamState {
    id: number | null;
    team: PlanTeam;
    setId?: (id: number) => void;
    setTeam: (team: Partial<PlanTeam>) => void;
    resetTeam: () => void;
    getTeamWithFetch?: (id: number) => Promise<PlanTeam>;
  }

  interface PlanTeamMeta {
    id: number;
    planTeamId: number;
    mainName: string;
    duration: number;
    startDate: Date | string;
    prepareDate: number;
    leader?: Member;
    guide?: Member;
    staybehind?: Member;
    stats: TeamStats;
    teamSize: number;
    eventState: EventStateDict;
  }

  interface PlanTeamMetaStore {
    teamMetas: PlanTeamMeta[];
    setPlanTeamMeta: (meta: PlanTeamMeta[]) => void;
    addPlanTeamMeta: (meta: PlanTeamMeta) => void;
    updatePlanTeamMeta: (id: number, updated: Partial<PlanTeamMeta>) => void;
    removePlanTeamMeta: (id: number) => void;
    getPlanTeamMetaById: (id: number) => PlanTeamMeta | undefined;
  }

  type TeamStats = {
    male: number;
    female: number;
    clubexec: number;
    nonClubexec: number;
    new: number;
    old: number;
  }

  type TeamType = [TeamCategory, TeamActivityType];
}

export {}