import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TeamRole, Gender } from "@/types/enum";
import { parseEnumKey } from "@/lib/utility";

const initialMember: Member = {
    name: "",
    studentNumber: "",
    IDNumber: "",
    phone: "",
    role: parseEnumKey(TeamRole, TeamRole.NormalMember),
    gender: parseEnumKey(Gender, Gender.Male),
    address: "",
    email: "",
    department: "",
    emergencyContact: "",
    emergencyPhone: "",
};

export const useDraftTeamMemberStore = create<DraftTeamMemberState>()(
    persist(
        (set) => ({
            member: initialMember,
            setMember: (member: Partial<Member>) =>
                set((state) => ({
                    member: { ...state.member, ...member } as Member,
                })),
            resetMember: () => set({ member: initialMember }),
        }),
    {
      name: "draftTeamMember",
    }
  )
)