import { TeamCategory, TeamActivityType, TeamRole } from "@/types/enum";
import { parseEnumKey } from "@/lib/utility";

export const inputModel = {
  role: [
    {
      id: 1,
      label: TeamRole.Leader,
      dataName: parseEnumKey(TeamRole, TeamRole.Leader)
    },
    {
      id: 2,
      label: TeamRole.Guide,
      dataName: parseEnumKey(TeamRole, TeamRole.Guide)
    },
    {
      id: 3,
      label: TeamRole.StayBehind,
      dataName: parseEnumKey(TeamRole, TeamRole.StayBehind)
    },
  ],
  teamTye: [
    {
      id: 1,
      label: TeamCategory.General,
      type: "teamCategory",
      dataName: parseEnumKey(TeamCategory, TeamCategory.General)
    },
    {
      id: 2,
      label: TeamCategory.Technical,
      type: "teamCategory",
      dataName: parseEnumKey(TeamCategory, TeamCategory.Technical)
    },
    {
      id: 3,
      label: TeamActivityType.Official,
      type: "teamActivity",
      dataName: parseEnumKey(TeamActivityType, TeamActivityType.Official)
    },
    {
      id: 4,
      label: TeamActivityType.Private,
      type: "teamActivity",
      dataName: parseEnumKey(TeamActivityType, TeamActivityType.Private)
    },
    {
      id: 5,
      label: TeamActivityType.Exploration,
      type: "teamActivity",
      dataName: parseEnumKey(TeamActivityType, TeamActivityType.Exploration)
    },
  ],
  transportType: [
    {
      id: 1,
      label: "機車往返",
      dataName: "motorcycle",
    },
    {
      id: 2,
      label: "開車往返",
      dataName: "drive",
    },
    {
      id: 3,
      label: "包車前往",
      dataName: "privateShuttle-go",
    },
    {
      id: 4,
      label: "包車返回",
      dataName: "privateShuttle-back",
    },
    {
      id: 5,
      label: "大眾交通前往",
      dataName: "publicShuttle-go",
    },
    {
      id: 6,
      label: "大眾交通返回",
      dataName: "publicShuttle-back",
    },
  ],
};